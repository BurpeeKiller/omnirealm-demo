#!/usr/bin/env python3
"""Test du système de progression OmniScan avec une image"""

import asyncio
import aiohttp
import time
import sys
from PIL import Image, ImageDraw, ImageFont
import io

async def test_progress():
    """Test l'upload avec progression"""
    
    # Créer une image de test avec du texte
    img = Image.new('RGB', (800, 600), color='white')
    draw = ImageDraw.Draw(img)
    
    # Ajouter du texte
    text = """FACTURE N° TEST-001
Date: 11/08/2025

Client: Test OmniScan
Adresse: 123 rue du Test

DESIGNATION                    QUANTITE    PRIX U.     TOTAL
----------------------------------------------------------
Service OCR                         1      25.00€     25.00€
Analyse IA                          1      35.00€     35.00€
Support technique                   2      15.00€     30.00€
----------------------------------------------------------
                              TOTAL HT:                90.00€
                              TVA 20%:                 18.00€
                              TOTAL TTC:              108.00€

Conditions de paiement: A réception
Mode de règlement: Virement

Merci de votre confiance!"""
    
    # Police par défaut
    y = 50
    for line in text.split('\n'):
        draw.text((50, y), line, fill='black')
        y += 20
    
    # Convertir en bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    # URL de l'API
    base_url = "http://localhost:8001/api/v1"
    
    # Créer un FormData avec le fichier
    form = aiohttp.FormData()
    form.add_field('file', img_bytes.read(), filename='test_facture.png', content_type='image/png')
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
        last_percentage = -1
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
                
                # Afficher si changement
                if message != last_message or percentage != last_percentage:
                    bar_length = 30
                    filled = int(bar_length * percentage / 100)
                    bar = '█' * filled + '░' * (bar_length - filled)
                    
                    print(f"\r[{bar}] {percentage:3}% - {message}          ", end='', flush=True)
                    last_message = message
                    last_percentage = percentage
                
                # Vérifier le statut
                if status['status'] == 'completed':
                    print(f"\n\n✅ Traitement terminé!")
                    
                    # Afficher le résultat
                    result = status.get('result', {})
                    if result:
                        print(f"\n📄 Texte extrait ({result.get('text_length', 0)} caractères):")
                        text = result.get('extracted_text', '')
                        if text:
                            print("-" * 50)
                            print(text[:300] + "..." if len(text) > 300 else text)
                            print("-" * 50)
                        
                        if 'ai_analysis' in result:
                            ai = result['ai_analysis']
                            print(f"\n🤖 Analyse IA:")
                            print(f"   Type détecté: {ai.get('document_type', 'N/A')}")
                            print(f"   Confiance: {ai.get('confidence', 0)*100:.1f}%")
                            print(f"   Résumé: {ai.get('summary', 'N/A')[:100]}...")
                            
                            if 'key_points' in ai:
                                print(f"\n   Points clés:")
                                for point in ai.get('key_points', [])[:3]:
                                    print(f"   • {point}")
                        
                        # Temps de traitement
                        if 'processing_time' in result:
                            times = result['processing_time']
                            print(f"\n⏱️  Temps de traitement:")
                            print(f"   OCR: {times.get('ocr', 0):.2f}s")
                            print(f"   IA: {times.get('ai', 0):.2f}s")
                            print(f"   Total: {times.get('total', 0):.2f}s")
                    break
                
                elif status['status'] == 'failed':
                    print(f"\n\n❌ Échec: {status.get('error', 'Erreur inconnue')}")
                    break
                
                # Attendre avant la prochaine vérification
                await asyncio.sleep(0.5)

if __name__ == "__main__":
    print("🧪 Test du système de progression OmniScan avec image")
    print("=" * 60)
    
    try:
        asyncio.run(test_progress())
    except KeyboardInterrupt:
        print("\n\n⏹️  Test interrompu")
    except Exception as e:
        print(f"\n\n❌ Erreur: {e}")
        import traceback
        traceback.print_exc()