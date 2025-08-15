#!/usr/bin/env python3
"""Test du système de progression OmniScan"""

import asyncio
import aiohttp
import time
import sys

async def test_progress():
    """Test l'upload avec progression"""
    
    # Créer un fichier de test
    test_content = """
    Ceci est un document de test pour OmniScan.
    
    Le système devrait:
    1. Retourner immédiatement un job_id
    2. Permettre de suivre la progression
    3. Afficher les étapes OCR et analyse IA
    
    Ce document contient suffisamment de texte pour tester l'OCR et l'analyse IA.
    
    Facture N° TEST-001
    Date: 11/08/2025
    
    Article 1 - Test OCR - 10.00€
    Article 2 - Test IA - 20.00€
    
    Total: 30.00€ TTC
    """.encode('utf-8')
    
    # URL de l'API
    base_url = "http://localhost:8001/api/v1"
    
    # Créer un FormData avec le fichier
    form = aiohttp.FormData()
    form.add_field('file', test_content, filename='test.pdf', content_type='application/pdf')
    form.add_field('detail_level', 'medium')
    form.add_field('include_structured_data', 'true')
    
    async with aiohttp.ClientSession() as session:
        # 1. Lancer l'upload
        print("📤 Upload du document...")
        async with session.post(f"{base_url}/upload/simple", data=form) as resp:
            if resp.status != 202:
                print(f"❌ Erreur upload: {resp.status}")
                text = await resp.text()
                print(text)
                return
            
            data = await resp.json()
            job_id = data['job_id']
            print(f"✅ Job créé: {job_id}")
        
        # 2. Suivre la progression
        print("\n📊 Suivi de la progression:")
        print("-" * 50)
        
        last_message = ""
        while True:
            async with session.get(f"{base_url}/job/{job_id}/status") as resp:
                if resp.status != 200:
                    print(f"❌ Erreur status: {resp.status}")
                    break
                
                status = await resp.json()
                
                # Afficher la progression
                progress = status['progress']
                percentage = progress['percentage']
                message = progress['message']
                
                # Afficher seulement si le message change
                if message != last_message:
                    bar_length = 30
                    filled = int(bar_length * percentage / 100)
                    bar = '█' * filled + '░' * (bar_length - filled)
                    
                    print(f"\r[{bar}] {percentage:3}% - {message}", end='', flush=True)
                    last_message = message
                
                # Vérifier le statut
                if status['status'] == 'completed':
                    print(f"\n\n✅ Traitement terminé!")
                    
                    # Afficher le résultat
                    result = status.get('result', {})
                    if result:
                        print(f"\n📄 Texte extrait ({result.get('text_length', 0)} caractères):")
                        text = result.get('extracted_text', '')[:200]
                        print(f"{text}...")
                        
                        if 'ai_analysis' in result:
                            ai = result['ai_analysis']
                            print(f"\n🤖 Analyse IA:")
                            print(f"   Type: {ai.get('document_type', 'N/A')}")
                            print(f"   Résumé: {ai.get('summary', 'N/A')[:100]}...")
                    break
                
                elif status['status'] == 'failed':
                    print(f"\n\n❌ Échec: {status.get('error', 'Erreur inconnue')}")
                    break
                
                # Attendre avant la prochaine vérification
                await asyncio.sleep(0.5)

if __name__ == "__main__":
    print("🧪 Test du système de progression OmniScan")
    print("=" * 50)
    
    try:
        asyncio.run(test_progress())
    except KeyboardInterrupt:
        print("\n\n⏹️  Test interrompu")
    except Exception as e:
        print(f"\n\n❌ Erreur: {e}")