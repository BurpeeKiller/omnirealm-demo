"""
Base classes pour le système OCR modulaire
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional, Dict, Any, List, Union
from enum import Enum
from pathlib import Path
import numpy as np
from PIL import Image


class OutputFormat(Enum):
    """Formats de sortie supportés"""
    TEXT = "text"
    MARKDOWN = "markdown"
    JSON = "json"
    LATEX = "latex"
    HTML = "html"
    CSV = "csv"  # Pour les tableaux


class OCRFeature(Enum):
    """Fonctionnalités OCR supportées"""
    BASIC_TEXT = "basic_text"
    TABLES = "tables"
    FORMULAS = "formulas"
    HANDWRITING = "handwriting"
    DIAGRAMS = "diagrams"
    MUSIC_SHEETS = "music_sheets"
    INTERACTIVE = "interactive"  # Sélection de zones
    BATCH = "batch"  # Traitement par lot
    MULTILINGUAL = "multilingual"


@dataclass
class BoundingBox:
    """Coordonnées d'une zone de texte"""
    x: int
    y: int
    width: int
    height: int
    confidence: float = 0.0


@dataclass
class ExtractedTable:
    """Tableau extrait"""
    headers: List[str]
    rows: List[List[str]]
    bbox: Optional[BoundingBox] = None


@dataclass
class ExtractedFormula:
    """Formule mathématique extraite"""
    latex: str
    text: str
    bbox: Optional[BoundingBox] = None


@dataclass
class OCRResult:
    """Résultat unifié de l'OCR"""
    # Texte brut
    text: str
    
    # Formats structurés
    markdown: Optional[str] = None
    json_data: Optional[Dict[str, Any]] = None
    html: Optional[str] = None
    
    # Éléments extraits
    tables: Optional[List[ExtractedTable]] = None
    formulas: Optional[List[ExtractedFormula]] = None
    
    # Métadonnées
    confidence: float = 0.0
    processing_time: float = 0.0
    page_count: int = 1
    language: Optional[str] = None
    
    # Zones de texte avec coordonnées
    text_blocks: Optional[List[Dict[str, Any]]] = None
    
    # Warnings ou infos
    warnings: Optional[List[str]] = None
    
    def to_format(self, format: OutputFormat) -> str:
        """Convertir le résultat dans le format demandé"""
        if format == OutputFormat.TEXT:
            return self.text
        elif format == OutputFormat.MARKDOWN:
            return self.markdown or self.text
        elif format == OutputFormat.JSON:
            return str(self.json_data or {"text": self.text})
        elif format == OutputFormat.HTML:
            return self.html or f"<p>{self.text}</p>"
        elif format == OutputFormat.LATEX:
            # Inclure les formules si présentes
            if self.formulas:
                latex_parts = [self.text]
                for formula in self.formulas:
                    latex_parts.append(f"$${formula.latex}$$")
                return "\n\n".join(latex_parts)
            return self.text
        elif format == OutputFormat.CSV:
            # Retourner le premier tableau si présent
            if self.tables and len(self.tables) > 0:
                table = self.tables[0]
                csv_lines = [",".join(table.headers)]
                for row in table.rows:
                    csv_lines.append(",".join(row))
                return "\n".join(csv_lines)
            return ""
        else:
            return self.text


@dataclass
class OCRConfig:
    """Configuration pour l'OCR"""
    # Général
    languages: List[str] = None
    output_format: OutputFormat = OutputFormat.TEXT
    
    # Fonctionnalités
    extract_tables: bool = False
    extract_formulas: bool = False
    enable_preprocessing: bool = True
    enable_postprocessing: bool = True
    
    # Zones d'intérêt
    regions: Optional[List[BoundingBox]] = None
    
    # Performance
    use_gpu: bool = False
    batch_size: int = 1
    max_pages: Optional[int] = None
    
    # Qualité
    min_confidence: float = 0.0
    enhance_quality: bool = True
    
    def __post_init__(self):
        if self.languages is None:
            self.languages = ["fra", "eng"]


class OCREngine(ABC):
    """Interface abstraite pour un moteur OCR"""
    
    def __init__(self, config: Optional[OCRConfig] = None):
        self.config = config or OCRConfig()
        self._initialized = False
    
    @abstractmethod
    async def initialize(self) -> None:
        """Initialiser le moteur (charger modèles, etc.)"""
        pass
    
    @abstractmethod
    async def process_image(
        self,
        image: Union[str, Path, Image.Image, np.ndarray],
        config: Optional[OCRConfig] = None
    ) -> OCRResult:
        """Traiter une image"""
        pass
    
    @abstractmethod
    async def process_pdf(
        self,
        pdf_path: Union[str, Path],
        config: Optional[OCRConfig] = None
    ) -> OCRResult:
        """Traiter un PDF"""
        pass
    
    @abstractmethod
    def get_supported_features(self) -> List[OCRFeature]:
        """Retourner les fonctionnalités supportées"""
        pass
    
    @abstractmethod
    def get_supported_languages(self) -> List[str]:
        """Retourner les langues supportées"""
        pass
    
    @abstractmethod
    def get_info(self) -> Dict[str, Any]:
        """Informations sur le moteur"""
        pass
    
    async def process_document(
        self,
        file_path: Union[str, Path],
        file_type: str,
        config: Optional[OCRConfig] = None
    ) -> OCRResult:
        """Méthode générique pour traiter un document"""
        file_path = Path(file_path)
        config = config or self.config
        
        if not self._initialized:
            await self.initialize()
        
        if file_type.lower() == "pdf":
            return await self.process_pdf(file_path, config)
        elif file_type.lower() in ["jpg", "jpeg", "png", "tiff", "bmp", "webp"]:
            return await self.process_image(file_path, config)
        else:
            raise ValueError(f"Type de fichier non supporté: {file_type}")
    
    async def process_batch(
        self,
        file_paths: List[Union[str, Path]],
        config: Optional[OCRConfig] = None
    ) -> List[OCRResult]:
        """Traiter plusieurs documents"""
        results = []
        for file_path in file_paths:
            file_path = Path(file_path)
            file_type = file_path.suffix.lstrip(".")
            result = await self.process_document(file_path, file_type, config)
            results.append(result)
        return results
    
    def can_handle(self, feature: OCRFeature) -> bool:
        """Vérifier si le moteur supporte une fonctionnalité"""
        return feature in self.get_supported_features()
    
    async def cleanup(self) -> None:
        """Nettoyer les ressources (modèles en mémoire, etc.)"""
        pass