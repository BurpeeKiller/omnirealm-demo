#!/usr/bin/env python3
"""
Test simple d'OCR pour vérifier que le moteur léger peut fonctionner
sans toutes les dépendances
"""

import asyncio
import time
import os
import sys
from pathlib import Path
from typing import Dict, Any
import tempfile

# Test basique sans imports lourds
def create_simple_test_image():
    """Créer une image de test simple sans dépendances lourdes"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        # Image test simple
        img = Image.new('RGB', (400, 200), color='white')
        draw = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.load_default()
        except:
            font = None
        
        text = "Test OCR Simple\nOmniScan Performance\n49€/mois Premium"
        draw.multiline_text((20, 50), text, fill='black', font=font, spacing=10)
        
        # Sauvegarder dans temp
        temp_path = Path(tempfile.gettempdir()) / "omniscan_test.png"
        img.save(temp_path)
        
        return temp_path
    except ImportError as e:
        print(f"PIL non disponible: {e}")
        return None


def test_tesseract_basic():
    """Test basique avec Tesseract"""
    try:
        import pytesseract
        from PIL import Image
        
        # Créer image test
        test_path = create_simple_test_image()
        if not test_path:
            print("❌ Impossible de créer image de test")
            return False
        
        # Test OCR
        start_time = time.time()
        image = Image.open(test_path)
        text = pytesseract.image_to_string(image, lang='fra+eng')
        processing_time = time.time() - start_time
        
        # Nettoyer
        test_path.unlink()
        
        print(f"✅ Tesseract - Temps: {processing_time:.2f}s")
        print(f"   Texte extrait: '{text.strip()[:100]}'")
        
        return len(text.strip()) > 10
        
    except ImportError as e:
        print(f"❌ Tesseract non disponible: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur Tesseract: {e}")
        return False


def test_system_resources():
    """Tester les ressources système disponibles"""
    try:
        import psutil
        
        cpu_count = psutil.cpu_count()
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('.')
        
        print("\n🖥️ Ressources Système:")
        print(f"   CPU: {cpu_count} cores")
        print(f"   RAM Total: {memory.total / 1024**3:.1f} GB")
        print(f"   RAM Libre: {memory.available / 1024**3:.1f} GB")
        print(f"   Disque Libre: {disk.free / 1024**3:.1f} GB")
        
        # Analyser si suffisant pour OCR léger
        ram_gb = memory.available / 1024**3
        
        if ram_gb < 0.5:
            print("   ⚠️ RAM limitée - recommandé: Tesseract uniquement")
            return "tesseract_only"
        elif ram_gb < 1.0:
            print("   ✅ RAM suffisante - recommandé: OCR léger avec EasyOCR")
            return "lightweight_basic"
        else:
            print("   ✅ RAM confortable - recommandé: OCR léger complet")
            return "lightweight_full"
            
    except ImportError:
        print("❌ psutil non disponible")
        return "unknown"


def estimate_ocr_performance():
    """Estimer les performances possibles sur ce système"""
    print("\n📊 Estimation Performances OCR:")
    
    # Test Tesseract
    tesseract_works = test_tesseract_basic()
    
    # Analyser ressources
    recommendation = test_system_resources()
    
    # Recommandations
    print(f"\n🎯 Recommandation:")
    
    if not tesseract_works:
        print("   ❌ Configuration minimale insuffisante")
        print("   → Installer: apt-get install tesseract-ocr tesseract-ocr-fra")
        return False
    
    if recommendation == "tesseract_only":
        print("   📋 Configuration: Tesseract uniquement")
        print("   → Performance attendue: 2-5s par page, qualité de base")
        print("   → Recommandation: Upgrade RAM pour moteur léger")
        
    elif recommendation in ["lightweight_basic", "lightweight_full"]:
        print("   🚀 Configuration: Moteur OCR léger recommandé")
        print("   → Performance attendue: 1-3s par page, qualité premium") 
        print("   → Justification 49€/mois: Qualité supérieure + vitesse")
        
        if recommendation == "lightweight_full":
            print("   → Support EasyOCR + PaddleOCR disponible")
        else:
            print("   → EasyOCR recommandé (plus léger que PaddleOCR)")
    
    return True


def generate_deployment_config():
    """Générer configuration de déploiement optimisée"""
    recommendation = test_system_resources()
    
    config = {
        "ENABLE_LIGHTWEIGHT_OCR": "true" if recommendation != "tesseract_only" else "false",
        "ENABLE_EASY_OCR": "true" if recommendation in ["lightweight_basic", "lightweight_full"] else "false",
        "ENABLE_PADDLE_OCR": "true" if recommendation == "lightweight_full" else "false",
        "OCR_MEMORY_LIMIT_MB": "256" if recommendation == "tesseract_only" else "512",
        "OCR_CPU_THREADS": "2",
        "OCR_BATCH_SIZE": "1"
    }
    
    print(f"\n⚙️ Configuration Environnement Recommandée:")
    for key, value in config.items():
        print(f"   {key}={value}")
    
    # Sauvegarder config
    config_path = Path("./temp/ocr_config.env")
    config_path.parent.mkdir(exist_ok=True)
    
    with open(config_path, 'w') as f:
        f.write("# Configuration OCR optimisée pour ce VPS\n")
        f.write(f"# Générée le {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        for key, value in config.items():
            f.write(f"{key}={value}\n")
    
    print(f"   📁 Config sauvée: {config_path}")
    
    return config


def main():
    """Test principal"""
    print("🚀 Test Simple OCR - OmniScan VPS")
    print("=" * 50)
    
    # Tests de base
    success = estimate_ocr_performance()
    
    if success:
        # Générer configuration
        config = generate_deployment_config()
        
        print(f"\n✅ Tests terminés avec succès!")
        print(f"💡 Prochaine étape: Déployer avec la configuration recommandée")
        
        return True
    else:
        print(f"\n❌ Configuration insuffisante")
        print(f"🔧 Corriger la configuration système avant déploiement")
        
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)