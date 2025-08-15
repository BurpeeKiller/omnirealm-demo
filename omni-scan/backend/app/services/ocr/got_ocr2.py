"""
Moteur OCR GOT-OCR2.0 - State-of-the-art OCR avec support avancé
"""

import os
import time
from typing import Optional, Dict, Any, List, Union
from pathlib import Path
import numpy as np
from PIL import Image

from app.core.logging import get_logger
from .base import OCREngine, OCRResult, OCRConfig, OCRFeature, OutputFormat, ExtractedTable, ExtractedFormula, BoundingBox

logger = get_logger("ocr.got_ocr2")


class GOTOCR2Engine(OCREngine):
    """
    Moteur OCR basé sur GOT-OCR2.0
    
    GOT-OCR2.0 est un modèle de 580M paramètres qui peut:
    - Extraire du texte avec haute précision
    - Reconnaître des tableaux complexes
    - Extraire des formules mathématiques
    - Lire des partitions musicales
    - Gérer des diagrammes et schémas
    - Support OCR interactif par zones
    """
    
    def __init__(self, config: Optional[OCRConfig] = None):
        super().__init__(config)
        self.name = "GOT-OCR2.0"
        self.model = None
        self.tokenizer = None
        self.device = None
        
    async def initialize(self) -> None:
        """Initialiser le modèle GOT-OCR2.0"""
        if self._initialized:
            return
            
        try:
            import torch
            from transformers import AutoModel, AutoTokenizer
            
            logger.info("Initialisation de GOT-OCR2.0...")
            
            # Déterminer le device
            if self.config.use_gpu and torch.cuda.is_available():
                self.device = "cuda"
                logger.info(f"GPU détecté: {torch.cuda.get_device_name()}")
            else:
                self.device = "cpu"
                logger.info("Utilisation du CPU")
            
            # Charger le modèle
            model_name = os.getenv("GOT_OCR2_MODEL", "stepfun-ai/GOT-OCR2_0")
            logger.info(f"Chargement du modèle: {model_name}")
            
            self.tokenizer = AutoTokenizer.from_pretrained(
                model_name,
                trust_remote_code=True
            )
            
            self.model = AutoModel.from_pretrained(
                model_name,
                trust_remote_code=True,
                low_cpu_mem_usage=True,
                device_map=self.device,
                use_safetensors=True,
                pad_token_id=self.tokenizer.eos_token_id
            )
            
            # Mettre en mode évaluation
            self.model = self.model.eval()
            
            if self.device == "cuda":
                self.model = self.model.cuda()
            
            self._initialized = True
            logger.info("GOT-OCR2.0 initialisé avec succès")
            
        except ImportError as e:
            logger.error(f"Dépendances manquantes pour GOT-OCR2.0: {e}")
            raise RuntimeError("PyTorch et transformers sont requis pour GOT-OCR2.0")
        except Exception as e:
            logger.error(f"Erreur initialisation GOT-OCR2.0: {e}")
            raise
    
    async def process_image(
        self,
        image: Union[str, Path, Image.Image, np.ndarray],
        config: Optional[OCRConfig] = None
    ) -> OCRResult:
        """Traiter une image avec GOT-OCR2.0"""
        start_time = time.time()
        config = config or self.config
        
        if not self._initialized:
            await self.initialize()
        
        try:
            # Charger l'image
            if isinstance(image, (str, Path)):
                image_path = str(image)
            else:
                # Sauvegarder temporairement si ce n'est pas un chemin
                import tempfile
                with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
                    if isinstance(image, np.ndarray):
                        Image.fromarray(image).save(tmp.name)
                    elif isinstance(image, Image.Image):
                        image.save(tmp.name)
                    image_path = tmp.name
            
            # Déterminer le type d'OCR
            ocr_type = self._determine_ocr_type(config)
            
            # Traiter avec GOT-OCR2.0
            if config.regions:
                # OCR avec zones spécifiques
                result_text = await self._process_with_regions(image_path, config.regions, ocr_type)
            else:
                # OCR standard
                result_text = self.model.chat(self.tokenizer, image_path, ocr_type=ocr_type)
            
            # Parser le résultat selon le format
            parsed_result = self._parse_got_output(result_text, config)
            
            # Calculer le temps de traitement
            processing_time = time.time() - start_time
            
            # Créer le résultat
            result = OCRResult(
                text=parsed_result.get("text", result_text),
                markdown=parsed_result.get("markdown"),
                json_data=parsed_result.get("json_data"),
                tables=parsed_result.get("tables"),
                formulas=parsed_result.get("formulas"),
                confidence=0.95,  # GOT-OCR2.0 a généralement une très haute précision
                processing_time=processing_time,
                language=config.languages[0] if config.languages else "multi"
            )
            
            # Nettoyer le fichier temporaire si créé
            if not isinstance(image, (str, Path)) and os.path.exists(image_path):
                os.unlink(image_path)
            
            return result
            
        except Exception as e:
            logger.error(f"Erreur GOT-OCR2.0: {e}")
            raise
    
    async def process_pdf(
        self,
        pdf_path: Union[str, Path],
        config: Optional[OCRConfig] = None
    ) -> OCRResult:
        """Traiter un PDF avec GOT-OCR2.0"""
        start_time = time.time()
        config = config or self.config
        
        if not self._initialized:
            await self.initialize()
        
        try:
            # GOT-OCR2.0 supporte le multi-page natif
            ocr_type = self._determine_ocr_type(config)
            
            # Utiliser la méthode multi-crop pour les PDFs
            result_text = self.model.chat_crop(
                self.tokenizer,
                str(pdf_path),
                ocr_type=ocr_type
            )
            
            # Parser le résultat
            parsed_result = self._parse_got_output(result_text, config)
            
            processing_time = time.time() - start_time
            
            result = OCRResult(
                text=parsed_result.get("text", result_text),
                markdown=parsed_result.get("markdown"),
                json_data=parsed_result.get("json_data"),
                tables=parsed_result.get("tables"),
                formulas=parsed_result.get("formulas"),
                confidence=0.95,
                processing_time=processing_time,
                page_count=parsed_result.get("page_count", 1),
                language=config.languages[0] if config.languages else "multi"
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Erreur GOT-OCR2.0 PDF: {e}")
            raise
    
    def _determine_ocr_type(self, config: OCRConfig) -> str:
        """Déterminer le type d'OCR selon la configuration"""
        if config.output_format == OutputFormat.MARKDOWN or config.extract_tables or config.extract_formulas:
            return "format"  # Format structuré
        else:
            return "ocr"  # Texte simple
    
    async def _process_with_regions(
        self,
        image_path: str,
        regions: List[BoundingBox],
        ocr_type: str
    ) -> str:
        """Traiter avec des zones spécifiques"""
        results = []
        
        for region in regions:
            # Convertir BoundingBox en format attendu par GOT-OCR2.0
            box_str = f"{region.x},{region.y},{region.x + region.width},{region.y + region.height}"
            
            # OCR sur la zone
            result = self.model.chat(
                self.tokenizer,
                image_path,
                ocr_type=ocr_type,
                ocr_box=box_str
            )
            results.append(result)
        
        return "\n\n".join(results)
    
    def _parse_got_output(self, output: str, config: OCRConfig) -> Dict[str, Any]:
        """Parser la sortie de GOT-OCR2.0"""
        parsed = {
            "text": output,
            "page_count": 1
        }
        
        # Si format structuré, GOT-OCR2.0 retourne du markdown
        if config.output_format in [OutputFormat.MARKDOWN, OutputFormat.JSON]:
            parsed["markdown"] = output
            
            # Extraire les tableaux si présents
            if config.extract_tables:
                tables = self._extract_tables_from_markdown(output)
                if tables:
                    parsed["tables"] = tables
            
            # Extraire les formules si présentes
            if config.extract_formulas:
                formulas = self._extract_formulas_from_markdown(output)
                if formulas:
                    parsed["formulas"] = formulas
        
        return parsed
    
    def _extract_tables_from_markdown(self, markdown: str) -> List[ExtractedTable]:
        """Extraire les tableaux du markdown"""
        tables = []
        # TODO: Implémenter l'extraction de tableaux depuis le markdown
        # Pour l'instant, retourner une liste vide
        return tables
    
    def _extract_formulas_from_markdown(self, markdown: str) -> List[ExtractedFormula]:
        """Extraire les formules du markdown"""
        formulas = []
        # TODO: Implémenter l'extraction de formules
        # Chercher les patterns $$ ... $$ ou $ ... $
        import re
        
        # Formules en ligne
        inline_formulas = re.findall(r'\$([^\$]+)\$', markdown)
        for formula in inline_formulas:
            formulas.append(ExtractedFormula(
                latex=formula,
                text=formula  # TODO: Convertir en texte si nécessaire
            ))
        
        # Formules en bloc
        block_formulas = re.findall(r'\$\$([^\$]+)\$\$', markdown, re.MULTILINE | re.DOTALL)
        for formula in block_formulas:
            formulas.append(ExtractedFormula(
                latex=formula.strip(),
                text=formula.strip()
            ))
        
        return formulas
    
    def get_supported_features(self) -> List[OCRFeature]:
        """Fonctionnalités supportées par GOT-OCR2.0"""
        return [
            OCRFeature.BASIC_TEXT,
            OCRFeature.TABLES,
            OCRFeature.FORMULAS,
            OCRFeature.HANDWRITING,
            OCRFeature.DIAGRAMS,
            OCRFeature.MUSIC_SHEETS,
            OCRFeature.INTERACTIVE,
            OCRFeature.BATCH,
            OCRFeature.MULTILINGUAL
        ]
    
    def get_supported_languages(self) -> List[str]:
        """GOT-OCR2.0 supporte de nombreuses langues"""
        return [
            "eng", "fra", "deu", "spa", "ita", "por", "nld", "pol", "rus",
            "jpn", "kor", "chi_sim", "chi_tra", "ara", "hin", "tha", "vie",
            "ind", "mal", "ben", "tam", "tel", "mar", "guj", "ori", "pan"
        ]
    
    def get_info(self) -> Dict[str, Any]:
        """Informations sur le moteur"""
        return {
            "name": self.name,
            "version": "2.0",
            "type": "transformer-based",
            "model_size": "580M parameters",
            "requires_gpu": True,
            "recommended_gpu_vram": "8GB+",
            "supported_formats": ["jpg", "jpeg", "png", "tiff", "bmp", "pdf", "webp"],
            "max_resolution": "unlimited",
            "features": [f.value for f in self.get_supported_features()],
            "languages": self.get_supported_languages()[:10],  # Top 10
            "special_capabilities": [
                "Extraction de tableaux complexes",
                "Reconnaissance de formules mathématiques",
                "Lecture de partitions musicales",
                "OCR interactif par zones",
                "Support multi-page natif",
                "Export structuré (markdown, LaTeX)"
            ]
        }
    
    async def cleanup(self) -> None:
        """Nettoyer les ressources"""
        if self.model is not None:
            del self.model
            self.model = None
        if self.tokenizer is not None:
            del self.tokenizer
            self.tokenizer = None
        
        # Libérer la mémoire GPU si utilisée
        if self.device == "cuda":
            try:
                import torch
                torch.cuda.empty_cache()
            except:
                pass
        
        self._initialized = False
        logger.info("GOT-OCR2.0 nettoyé")