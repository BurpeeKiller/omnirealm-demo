#!/usr/bin/env python3
"""
Test complet du parcours SaaS OmniScan avec Playwright
Simule tous les chemins utilisateur possibles
"""

import asyncio
from playwright.async_api import async_playwright
import os
import time

class OmniScanSaaSTest:
    def __init__(self):
        self.frontend_url = "http://localhost:3004"
        self.backend_url = "http://localhost:8001"
        self.test_results = []
        
    async def test_full_flow(self):
        """Test complet du parcours utilisateur SaaS"""
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False)  # Visible pour debug
            context = await browser.new_context()
            page = await context.new_page()
            
            print("🧪 DÉMARRAGE DES TESTS OMNISCAN SAAS")
            print("="*50)
            
            # Test 1: Page d'accueil et premier scan gratuit
            await self.test_homepage_and_first_scan(page)
            
            # Test 2: Utilisation des scans gratuits jusqu'à la limite
            await self.test_free_quota_limit(page)
            
            # Test 3: Flow d'authentification
            await self.test_auth_flow(page)
            
            # Test 4: Page de pricing
            await self.test_pricing_page(page)
            
            # Test 5: Checkout Stripe
            await self.test_checkout_flow(page)
            
            # Test 6: Fonctionnalités Pro
            await self.test_pro_features(page)
            
            # Test 7: Pages légales
            await self.test_legal_pages(page)
            
            # Test 8: Responsive mobile
            await self.test_mobile_responsive(page)
            
            # Test 9: Erreurs et edge cases
            await self.test_error_handling(page)
            
            # Test 10: Performance
            await self.test_performance(page)
            
            await browser.close()
            
            # Rapport final
            self.print_test_report()
    
    async def test_homepage_and_first_scan(self, page):
        """Test 1: Page d'accueil et premier scan"""
        print("\n📍 TEST 1: Page d'accueil et premier scan")
        
        try:
            # Aller sur la page d'accueil
            await page.goto(self.frontend_url)
            await page.wait_for_load_state('networkidle')
            
            # Vérifier les éléments essentiels
            checks = {
                "Titre principal": await page.locator('h1:has-text("OmniScan OCR")').is_visible(),
                "Zone d'upload": await page.locator('text=Glissez-déposez un fichier').is_visible(),
                "Indicateur quota": await page.locator('text=Scans restants').is_visible(),
                "Bouton connexion": await page.locator('button:has-text("Se connecter")').is_visible(),
            }
            
            for element, visible in checks.items():
                status = "✅" if visible else "❌"
                self.test_results.append(f"{status} {element}")
                print(f"  {status} {element}")
            
            # Tester l'upload d'un fichier
            print("\n  🔄 Test upload fichier...")
            
            # Créer un fichier test
            test_file = "/tmp/test-saas.txt"
            with open(test_file, "w") as f:
                f.write("Test SaaS OmniScan")
            
            # Upload via input file
            file_input = await page.locator('input[type="file"]').first
            if file_input:
                await file_input.set_input_files(test_file)
                
                # Attendre le traitement
                await page.wait_for_selector('text=Traitement en cours', timeout=5000)
                
                # Vérifier le résultat
                result_visible = await page.wait_for_selector('text=Traité avec succès', timeout=10000)
                if result_visible:
                    print("  ✅ Upload et traitement réussis")
                    self.test_results.append("✅ Upload fonctionnel")
                    
                    # Vérifier quota mis à jour
                    quota_text = await page.locator('text=/\\d+\\/3/').text_content()
                    print(f"  ℹ️  Quota après scan: {quota_text}")
            
        except Exception as e:
            print(f"  ❌ Erreur: {e}")
            self.test_results.append(f"❌ Erreur homepage: {str(e)}")
    
    async def test_free_quota_limit(self, page):
        """Test 2: Limite des scans gratuits"""
        print("\n📍 TEST 2: Limite quota gratuit")
        
        try:
            # Simuler 2 scans supplémentaires pour atteindre la limite
            for i in range(2):
                print(f"  🔄 Scan #{i+2}...")
                
                # Cliquer sur "Scanner un autre document"
                await page.click('button:has-text("Scanner un autre document")')
                await page.wait_for_timeout(500)
                
                # Upload un fichier
                file_input = await page.locator('input[type="file"]').first
                await file_input.set_input_files("/tmp/test-saas.txt")
                
                # Attendre le résultat
                await page.wait_for_selector('text=Traité avec succès', timeout=10000)
            
            # Essayer un 4ème scan (devrait déclencher la limite)
            print("  🔄 Tentative scan #4 (au-delà de la limite)...")
            await page.click('button:has-text("Scanner un autre document")')
            
            file_input = await page.locator('input[type="file"]').first
            await file_input.set_input_files("/tmp/test-saas.txt")
            
            # Vérifier si la popup de limite apparaît
            limit_popup = await page.wait_for_selector('text=Limite atteinte', timeout=5000)
            if limit_popup:
                print("  ✅ Popup limite quota affichée")
                self.test_results.append("✅ Gestion limite quota")
                
                # Vérifier les options proposées
                options = {
                    "Option connexion": await page.locator('text=Continuer gratuitement').is_visible(),
                    "Option Pro": await page.locator('text=Passer Pro').is_visible(),
                    "Prix affiché": await page.locator('text=49€').is_visible(),
                }
                
                for opt, visible in options.items():
                    status = "✅" if visible else "❌"
                    print(f"  {status} {opt}")
                
        except Exception as e:
            print(f"  ❌ Erreur quota: {e}")
            self.test_results.append(f"❌ Erreur test quota: {str(e)}")
    
    async def test_auth_flow(self, page):
        """Test 3: Flow d'authentification"""
        print("\n📍 TEST 3: Authentification magic link")
        
        try:
            # Cliquer sur "Se connecter" dans la popup
            await page.click('button:has-text("Se connecter")')
            await page.wait_for_timeout(500)
            
            # Vérifier la modal d'auth
            auth_modal = await page.wait_for_selector('text=Connexion sans mot de passe', timeout=3000)
            if auth_modal:
                print("  ✅ Modal authentification affichée")
                
                # Entrer un email
                await page.fill('input[type="email"]', 'test@omniscan.app')
                await page.click('button:has-text("Recevoir le lien magique")')
                
                # Vérifier la confirmation
                confirmation = await page.wait_for_selector('text=Email envoyé', timeout=5000)
                if confirmation:
                    print("  ✅ Email envoyé (mode demo)")
                    self.test_results.append("✅ Flow magic link")
                    
                    # Vérifier les instructions
                    instructions = await page.locator('text=Vérifiez votre boîte mail').is_visible()
                    if instructions:
                        print("  ✅ Instructions affichées")
            
        except Exception as e:
            print(f"  ❌ Erreur auth: {e}")
            self.test_results.append(f"❌ Erreur auth: {str(e)}")
    
    async def test_pricing_page(self, page):
        """Test 4: Page de pricing"""
        print("\n📍 TEST 4: Page de pricing")
        
        try:
            # Aller sur la page pricing
            await page.goto(f"{self.frontend_url}/pricing")
            await page.wait_for_load_state('networkidle')
            
            # Vérifier les éléments essentiels
            elements = {
                "Titre pricing": await page.locator('h1:has-text("Choisissez votre plan")').is_visible(),
                "Plan Gratuit": await page.locator('text=0€/mois').is_visible(),
                "Plan Pro": await page.locator('text=49€/mois').is_visible(),
                "Plan Entreprise": await page.locator('text=Sur devis').is_visible(),
                "Badge populaire": await page.locator('text=Populaire').is_visible(),
                "Features Pro": await page.locator('text=Scans illimités').is_visible(),
                "CTA Pro": await page.locator('button:has-text("Devenir Pro")').is_visible(),
                "Section FAQ": await page.locator('text=Questions fréquentes').is_visible(),
                "Garanties": await page.locator('text=100% Sécurisé').is_visible(),
            }
            
            for element, visible in elements.items():
                status = "✅" if visible else "❌"
                print(f"  {status} {element}")
                if not visible:
                    self.test_results.append(f"❌ Manque: {element}")
            
            # Vérifier FAQ
            faq_items = await page.locator('h3').all_text_contents()
            print(f"  ℹ️  FAQ trouvées: {len(faq_items)} questions")
            
        except Exception as e:
            print(f"  ❌ Erreur pricing: {e}")
            self.test_results.append(f"❌ Erreur pricing: {str(e)}")
    
    async def test_checkout_flow(self, page):
        """Test 5: Flow de checkout Stripe"""
        print("\n📍 TEST 5: Checkout Stripe")
        
        try:
            # Cliquer sur "Devenir Pro"
            await page.click('button:has-text("Devenir Pro")')
            await page.wait_for_timeout(1000)
            
            # En mode demo, vérifier la redirection ou l'erreur
            current_url = page.url
            if "stripe.com" in current_url:
                print("  ✅ Redirection Stripe OK")
                self.test_results.append("✅ Intégration Stripe")
            else:
                # Vérifier si on a un message demo
                demo_msg = await page.locator('text=Mode demo').is_visible()
                if demo_msg:
                    print("  ℹ️  Mode demo détecté (Stripe non configuré)")
                    self.test_results.append("⚠️  Stripe à configurer pour prod")
                else:
                    print("  ❌ Checkout non fonctionnel")
                    self.test_results.append("❌ Checkout à implémenter")
            
        except Exception as e:
            print(f"  ❌ Erreur checkout: {e}")
            self.test_results.append(f"❌ Erreur checkout: {str(e)}")
    
    async def test_legal_pages(self, page):
        """Test 7: Pages légales obligatoires"""
        print("\n📍 TEST 7: Pages légales")
        
        legal_pages = [
            ("CGU", "/terms", "Conditions Générales d'Utilisation"),
            ("Politique de confidentialité", "/privacy", "Politique de Confidentialité"),
            ("Mentions légales", "/legal", "Mentions Légales"),
            ("RGPD", "/gdpr", "Protection des données"),
            ("Cookies", "/cookies", "Politique de Cookies"),
        ]
        
        for name, url, title in legal_pages:
            try:
                await page.goto(f"{self.frontend_url}{url}")
                await page.wait_for_timeout(500)
                
                # Vérifier si la page existe
                if page.url.endswith("404") or await page.locator('text=404').is_visible():
                    print(f"  ❌ {name} - Page manquante")
                    self.test_results.append(f"❌ Manque: {name}")
                else:
                    # Chercher le titre
                    title_found = await page.locator(f'h1:has-text("{title}")').is_visible()
                    if title_found:
                        print(f"  ✅ {name} - Page existe")
                    else:
                        print(f"  ⚠️  {name} - Page existe mais contenu à compléter")
                        self.test_results.append(f"⚠️  {name} à compléter")
                        
            except Exception as e:
                print(f"  ❌ {name} - Erreur: {e}")
                self.test_results.append(f"❌ {name} erreur")
    
    async def test_mobile_responsive(self, page):
        """Test 8: Responsive mobile"""
        print("\n📍 TEST 8: Responsive mobile")
        
        # Tester différentes tailles d'écran
        viewports = [
            ("iPhone 12", 390, 844),
            ("iPad", 768, 1024),
            ("Desktop", 1920, 1080)
        ]
        
        for device, width, height in viewports:
            try:
                await page.set_viewport_size({"width": width, "height": height})
                await page.goto(self.frontend_url)
                await page.wait_for_timeout(500)
                
                # Vérifier que les éléments clés sont visibles
                upload_visible = await page.locator('text=Glissez-déposez').is_visible()
                if upload_visible:
                    print(f"  ✅ {device} ({width}x{height}) - OK")
                else:
                    print(f"  ❌ {device} - Problème d'affichage")
                    self.test_results.append(f"❌ Responsive {device}")
                    
            except Exception as e:
                print(f"  ❌ {device} - Erreur: {e}")
    
    async def test_error_handling(self, page):
        """Test 9: Gestion des erreurs"""
        print("\n📍 TEST 9: Gestion des erreurs")
        
        # Retour taille normale
        await page.set_viewport_size({"width": 1280, "height": 720})
        
        # Test 1: Upload fichier invalide
        try:
            await page.goto(self.frontend_url)
            
            # Créer un fichier non supporté
            invalid_file = "/tmp/test.xyz"
            with open(invalid_file, "w") as f:
                f.write("Invalid file type")
            
            file_input = await page.locator('input[type="file"]').first
            await file_input.set_input_files(invalid_file)
            
            # Vérifier message d'erreur
            error_msg = await page.wait_for_selector('text=Format non supporté', timeout=3000)
            if error_msg:
                print("  ✅ Erreur format fichier gérée")
            else:
                print("  ❌ Pas de message d'erreur pour format invalide")
                self.test_results.append("❌ Gestion erreur format")
                
        except Exception as e:
            print(f"  ⚠️  Test format invalide: {e}")
        
        # Test 2: Fichier trop gros
        try:
            # Simuler un gros fichier (normalement rejeté côté client)
            print("  ℹ️  Test fichier > 50MB à implémenter")
            
        except Exception as e:
            print(f"  ❌ Erreur test taille: {e}")
    
    async def test_performance(self, page):
        """Test 10: Performance"""
        print("\n📍 TEST 10: Performance")
        
        try:
            # Mesurer le temps de chargement
            start_time = time.time()
            await page.goto(self.frontend_url)
            await page.wait_for_load_state('networkidle')
            load_time = time.time() - start_time
            
            print(f"  ⏱️  Temps de chargement: {load_time:.2f}s")
            
            if load_time < 2:
                print("  ✅ Performance excellente")
            elif load_time < 4:
                print("  ⚠️  Performance acceptable")
            else:
                print("  ❌ Performance à optimiser")
                self.test_results.append("❌ Performance lente")
            
            # Vérifier la taille du bundle
            # (nécessiterait une analyse plus poussée)
            print("  ℹ️  Analyse bundle à faire avec Lighthouse")
            
        except Exception as e:
            print(f"  ❌ Erreur perf: {e}")
    
    def print_test_report(self):
        """Rapport final des tests"""
        print("\n" + "="*50)
        print("📊 RAPPORT FINAL DES TESTS SAAS")
        print("="*50)
        
        # Compter les résultats
        success = len([r for r in self.test_results if r.startswith("✅")])
        warnings = len([r for r in self.test_results if r.startswith("⚠️")])
        errors = len([r for r in self.test_results if r.startswith("❌")])
        
        print(f"\n✅ Succès: {success}")
        print(f"⚠️  Avertissements: {warnings}")
        print(f"❌ Erreurs: {errors}")
        
        if errors > 0:
            print("\n🚨 ÉLÉMENTS CRITIQUES MANQUANTS:")
            for result in self.test_results:
                if result.startswith("❌"):
                    print(f"  {result}")
        
        if warnings > 0:
            print("\n⚠️  ÉLÉMENTS À COMPLÉTER:")
            for result in self.test_results:
                if result.startswith("⚠️"):
                    print(f"  {result}")
        
        print("\n" + "="*50)
        print("📋 CHECKLIST PRODUCTION")
        print("="*50)
        
        checklist = """
        OBLIGATOIRE POUR LA PRODUCTION:
        
        ✅ Fonctionnalités Core:
        □ OCR fonctionnel
        □ Quota gratuit (3 scans)
        □ Limite quota avec popup
        □ Authentification magic link
        □ Page pricing
        
        ❌ Pages Légales (OBLIGATOIRE):
        □ Conditions Générales d'Utilisation (CGU)
        □ Politique de Confidentialité
        □ Mentions Légales
        □ Page RGPD / Protection des données
        □ Politique de Cookies
        □ Contact / Support
        
        ❌ Configuration Production:
        □ SMTP pour emails (SendGrid, Postmark, etc.)
        □ Stripe API keys (production)
        □ Redis pour sessions (ou alternative)
        □ Domaine et SSL
        □ Variables d'environnement sécurisées
        
        ⚠️  Améliorations Recommandées:
        □ Page 404 personnalisée
        □ Page d'erreur 500
        □ Favicon et meta tags
        □ Open Graph pour partage social
        □ Analytics (Plausible, Posthog)
        □ Monitoring erreurs (Sentry)
        □ Backup/Export données utilisateur
        □ Dashboard utilisateur
        □ Historique des scans (optionnel)
        □ API pour intégrations
        
        🎨 UX/UI:
        □ Logo et branding
        □ Animations de chargement
        □ Messages d'erreur clairs
        □ Onboarding nouveau utilisateur
        □ Emails transactionnels beaux
        □ Page de confirmation paiement
        □ Page d'annulation abonnement
        
        🔒 Sécurité:
        □ Rate limiting API
        □ Validation fichiers uploads
        □ Headers sécurité (CSP, etc.)
        □ Audit sécurité
        □ Tests de charge
        
        📱 Marketing:
        □ Landing page optimisée
        □ Témoignages clients
        □ Démo vidéo
        □ Blog/Documentation
        □ Programme d'affiliation
        """
        
        print(checklist)

# Lancer les tests
if __name__ == "__main__":
    tester = OmniScanSaaSTest()
    asyncio.run(tester.test_full_flow())