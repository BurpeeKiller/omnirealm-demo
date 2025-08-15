#!/usr/bin/env python3
"""
Script de test et benchmark pour le moteur OCR léger
Teste performance et qualité sur documents échantillons
"""

import asyncio
import time
import os
import sys
from pathlib import Path
import psutil
import subprocess
from typing import Dict, Any, List

# Ajouter le répertoire parent au path pour les imports
sys.path.append(str(Path(__file__).parent))

from app.services.ocr.lightweight_ocr import LightweightOCREngine
from app.services.ocr.tesseract import TesseractEngine
from app.services.ocr.base import OCRConfig
from app.core.logging import get_logger

logger = get_logger("ocr.benchmark")


class OCRBenchmark:
    """Classe pour benchmarker les performances OCR"""
    
    def __init__(self):
        self.test_documents = [
            # Documents de test dans le dossier test
            ("./test/Le traitement des plantes par les plantes.pdf", "pdf", "Document technique français"),
            ("./test/Les 4 avantages des mauvaises herbes au potager.pdf", "pdf", "Article court français"),
            ("./test/purin de tomate.pdf", "pdf", "Document pratique"),
        ]
        
        # Créer des documents de test simples si les PDF ne sont pas disponibles
        self.fallback_tests = self._create_test_images()
    
    def _create_test_images(self) -> List[tuple]:
        """Créer des images de test simples si les PDFs ne sont pas disponibles"""
        from PIL import Image, ImageDraw, ImageFont
        
        test_dir = Path("./temp")
        test_dir.mkdir(exist_ok=True)
        
        tests = []
        
        # Test 1: Texte simple
        img = Image.new('RGB', (800, 400), color='white')
        draw = ImageDraw.Draw(img)
        
        try:
            # Essayer de charger une police système
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
        except:
            font = ImageFont.load_default()
        
        text = """Ceci est un test d'OCR simple.
        
Ce document contient du texte en français
avec quelques mots en anglais pour tester
la capacité multilingue du moteur OCR.

Performance et qualité sont essentielles
pour justifier le premium à 49€/mois."""
        
        draw.multiline_text((50, 50), text, fill='black', font=font, spacing=10)
        
        test_path = test_dir / "test_simple.png"
        img.save(test_path)
        tests.append((str(test_path), "png", "Texte simple français/anglais"))
        
        # Test 2: Document plus complexe
        img2 = Image.new('RGB', (600, 800), color='white')
        draw2 = ImageDraw.Draw(img2)
        
        complex_text = """FACTURE N° 2025-001

Date: 13 août 2025
Client: OmniRealm SAS
Adresse: 123 Rue de la Tech, 75001 Paris

Articles:
- OCR Premium Service    49,00 €
- Support technique      25,00 €
- Hébergement cloud      15,00 €

Sous-total:             89,00 €
TVA (20%):              17,80 €
TOTAL:                 106,80 €

Conditions de paiement: 30 jours
IBAN: FR76 1234 5678 9012 3456 789"""
        
        draw2.multiline_text((30, 30), complex_text, fill='black', font=font, spacing=8)
        
        test_path2 = test_dir / "test_facture.png"
        img2.save(test_path2)
        tests.append((str(test_path2), "png", "Facture structurée"))
        
        return tests
    
    async def benchmark_engine(self, engine_name: str, engine: Any) -> Dict[str, Any]:
        """Benchmarker un moteur OCR spécifique"""
        logger.info(f"\n=== Benchmark {engine_name} ===")
        
        results = {
            "engine": engine_name,
            "total_time": 0,
            "total_memory_peak": 0,
            "documents": [],
            "success_rate": 0,
            "avg_confidence": 0
        }
        
        successful_tests = 0
        total_confidence = 0
        
        # Tester avec tous les documents
        test_docs = self.test_documents if any(Path(doc[0]).exists() for doc in self.test_documents) else self.fallback_tests
        
        for doc_path, doc_type, description in test_docs:
            if not Path(doc_path).exists():
                logger.warning(f"Document non trouvé: {doc_path}")
                continue
                
            logger.info(f"Test: {description} ({Path(doc_path).name})")
            
            # Mesurer mémoire avant
            process = psutil.Process()
            memory_before = process.memory_info().rss / 1024 / 1024
            
            start_time = time.time()
            
            try:
                # Traitement OCR
                result = await engine.process_document(doc_path, doc_type)
                processing_time = time.time() - start_time
                
                # Mesurer mémoire après
                memory_after = process.memory_info().rss / 1024 / 1024
                memory_usage = memory_after - memory_before
                
                # Analyser résultat
                text_length = len(result.text.strip())
                confidence = result.confidence
                
                doc_result = {
                    "document": description,
                    "success": True,
                    "processing_time": processing_time,
                    "memory_usage_mb": memory_usage,
                    "text_length": text_length,
                    "confidence": confidence,
                    "text_preview": result.text[:200] + "..." if text_length > 200 else result.text
                }
                
                results["documents"].append(doc_result)
                results["total_time"] += processing_time
                results["total_memory_peak"] = max(results["total_memory_peak"], memory_usage)
                
                if text_length > 10:  # Considérer comme succès si au moins 10 caractères
                    successful_tests += 1
                    total_confidence += confidence
                
                logger.info(f"  ✓ Temps: {processing_time:.2f}s, Mémoire: {memory_usage:.1f}MB, Confiance: {confidence:.2f}, Caractères: {text_length}")
                
            except Exception as e:
                logger.error(f"  ✗ Erreur: {e}")
                doc_result = {
                    "document": description,
                    "success": False,
                    "error": str(e),
                    "processing_time": time.time() - start_time,
                    "memory_usage_mb": 0,
                    "text_length": 0,
                    "confidence": 0
                }
                results["documents"].append(doc_result)
        
        # Calculer métriques finales
        total_docs = len([doc for doc in results["documents"]])
        results["success_rate"] = (successful_tests / total_docs * 100) if total_docs > 0 else 0
        results["avg_confidence"] = (total_confidence / successful_tests) if successful_tests > 0 else 0
        
        return results
    
    async def run_full_benchmark(self) -> Dict[str, Any]:
        """Executer benchmark complet de tous les moteurs"""
        logger.info("🚀 Démarrage du benchmark OCR complet")
        
        benchmark_results = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "system_info": self._get_system_info(),
            "engines": {}
        }
        
        # Test 1: Moteur Léger
        try:
            logger.info("Initialisation moteur OCR léger...")
            lightweight_engine = LightweightOCREngine()
            await lightweight_engine.initialize()
            
            results = await self.benchmark_engine("lightweight", lightweight_engine)
            benchmark_results["engines"]["lightweight"] = results
            
            await lightweight_engine.cleanup()
            
        except Exception as e:
            logger.error(f"Impossible de tester le moteur léger: {e}")
            benchmark_results["engines"]["lightweight"] = {"error": str(e)}
        
        # Test 2: Tesseract (référence)
        try:
            logger.info("Initialisation Tesseract...")
            tesseract_engine = TesseractEngine()
            await tesseract_engine.initialize()
            
            results = await self.benchmark_engine("tesseract", tesseract_engine)
            benchmark_results["engines"]["tesseract"] = results
            
            await tesseract_engine.cleanup()
            
        except Exception as e:
            logger.error(f"Impossible de tester Tesseract: {e}")
            benchmark_results["engines"]["tesseract"] = {"error": str(e)}
        
        return benchmark_results
    
    def _get_system_info(self) -> Dict[str, Any]:
        """Obtenir informations système"""
        try:
            return {
                "cpu_count": psutil.cpu_count(),
                "memory_total_gb": psutil.virtual_memory().total / 1024**3,
                "memory_available_gb": psutil.virtual_memory().available / 1024**3,
                "disk_free_gb": psutil.disk_usage('.').free / 1024**3,
                "python_version": sys.version.split()[0],
                "platform": sys.platform
            }
        except Exception as e:
            return {"error": f"Impossible d'obtenir info système: {e}"}
    
    def generate_report(self, results: Dict[str, Any]) -> str:
        """Générer rapport de benchmark"""
        report = f"""
# 📊 Rapport de Benchmark OCR - OmniScan
**Date**: {results['timestamp']}

## 🖥️ Configuration Système
- **CPU**: {results['system_info'].get('cpu_count', 'N/A')} cores
- **RAM Total**: {results['system_info'].get('memory_total_gb', 0):.1f} GB  
- **RAM Disponible**: {results['system_info'].get('memory_available_gb', 0):.1f} GB
- **Espace Disque**: {results['system_info'].get('disk_free_gb', 0):.1f} GB

## 🏆 Résumé Comparatif

"""
        
        for engine_name, engine_results in results['engines'].items():
            if 'error' in engine_results:
                report += f"### ❌ {engine_name.title()}\n**Erreur**: {engine_results['error']}\n\n"
                continue
            
            report += f"""### {'🥇' if engine_name == 'lightweight' else '🥈'} {engine_name.title()}
- **Temps Total**: {engine_results['total_time']:.2f}s
- **Mémoire Peak**: {engine_results['total_memory_peak']:.1f} MB
- **Taux Succès**: {engine_results['success_rate']:.1f}%
- **Confiance Moy.**: {engine_results['avg_confidence']:.2f}

"""
        
        # Recommandation
        lightweight_results = results['engines'].get('lightweight')
        tesseract_results = results['engines'].get('tesseract')
        
        if lightweight_results and tesseract_results and 'error' not in lightweight_results:
            lightweight_time = lightweight_results['total_time']
            tesseract_time = tesseract_results.get('total_time', float('inf'))
            
            if lightweight_time < tesseract_time and lightweight_results['success_rate'] >= 80:
                report += """## 🎯 Recommandation

✅ **ADOPTER le moteur OCR léger**
- Performance supérieure à Tesseract
- Optimisé pour les ressources VPS limitées  
- Justifie le premium 49€/mois avec une meilleure qualité OCR

"""
            else:
                report += """## ⚠️ Recommandation

🤔 **CONTINUER avec Tesseract** (pour le moment)
- Le moteur léger nécessite des optimisations supplémentaires
- Performance ou qualité insuffisante actuellement

"""
        
        # Détail par document
        report += "## 📋 Détails par Document\n\n"
        
        for engine_name, engine_results in results['engines'].items():
            if 'error' in engine_results:
                continue
                
            report += f"### {engine_name.title()}\n\n"
            
            for doc in engine_results['documents']:
                status = "✅" if doc['success'] else "❌"
                report += f"**{status} {doc['document']}**\n"
                
                if doc['success']:
                    report += f"- Temps: {doc['processing_time']:.2f}s\n"
                    report += f"- Mémoire: {doc['memory_usage_mb']:.1f} MB\n"
                    report += f"- Confiance: {doc['confidence']:.2f}\n"
                    report += f"- Caractères: {doc['text_length']}\n"
                    if doc.get('text_preview'):
                        report += f"- Aperçu: `{doc['text_preview'][:100]}...`\n"
                else:
                    report += f"- Erreur: {doc.get('error', 'Inconnue')}\n"
                
                report += "\n"
        
        return report


async def main():
    """Point d'entrée principal"""
    try:
        # Configuration environment
        os.environ["ENABLE_LIGHTWEIGHT_OCR"] = "true"
        os.environ["ENABLE_PADDLE_OCR"] = "true"  
        os.environ["ENABLE_EASY_OCR"] = "true"
        os.environ["OCR_MEMORY_LIMIT_MB"] = "512"
        
        # Lancer benchmark
        benchmark = OCRBenchmark()
        results = await benchmark.run_full_benchmark()
        
        # Générer et sauvegarder rapport
        report = benchmark.generate_report(results)
        
        report_path = Path("./temp/ocr_benchmark_report.md")
        report_path.parent.mkdir(exist_ok=True)
        report_path.write_text(report, encoding='utf-8')
        
        print(f"\n✅ Benchmark terminé !")
        print(f"📄 Rapport sauvegardé: {report_path}")
        print(f"\n{report}")
        
        return results
        
    except Exception as e:
        logger.error(f"Erreur benchmark: {e}")
        print(f"\n❌ Erreur benchmark: {e}")
        return None


if __name__ == "__main__":
    asyncio.run(main())