"""Tests pour le service de nettoyage de texte"""

from app.services.text_cleaner import text_cleaner


def test_clean_text_basic():
    """Test nettoyage de base"""
    text = "Ceci  est   un    test."
    cleaned = text_cleaner.clean_text(text)
    assert cleaned == "Ceci est un test."


def test_clean_text_punctuation():
    """Test correction ponctuation française"""
    text = "Bonjour ! Comment allez-vous ?"
    cleaned = text_cleaner.clean_text(text)
    assert "!" in cleaned
    assert "?" in cleaned


def test_clean_text_special_chars():
    """Test remplacement caractères spéciaux"""
    text = "Les œufs coûtent 5€ et les ﬁlets de ﬂétan aussi"
    cleaned = text_cleaner.clean_text(text)
    assert "oe" in cleaned
    assert "fi" in cleaned
    assert "fl" in cleaned


def test_detect_chapters():
    """Test détection des chapitres"""
    text = """
CHAPITRE 1 : Introduction
Contenu du chapitre 1

CHAPITRE 2 : Développement
Contenu du chapitre 2

Conclusion
Texte de conclusion
"""
    chapters = text_cleaner.detect_chapters(text)
    
    assert len(chapters) >= 2
    assert any("CHAPITRE 1" in ch["title"] for ch in chapters)
    assert any("CHAPITRE 2" in ch["title"] for ch in chapters)


def test_merge_hyphenated_words():
    """Test fusion des mots avec trait d'union"""
    text = "La docu-\nmentation est impor-\ntante"
    merged = text_cleaner.merge_hyphenated_words(text)
    assert "documentation" in merged
    assert "importante" in merged


def test_remove_page_numbers():
    """Test suppression numéros de page"""
    text = """
Contenu de la page
- 42 -

Suite du contenu
Page 43

Fin du document
158
"""
    cleaned = text_cleaner.remove_page_numbers(text)
    assert "42" not in cleaned
    assert "43" not in cleaned
    assert "158" not in cleaned
    assert "Contenu" in cleaned


def test_clean_ocr_artifacts():
    """Test nettoyage artefacts OCR"""
    text = "Test avec !!!!!!!! et §§§§§§§§§ caractères"
    cleaned = text_cleaner.clean_ocr_artifacts(text)
    assert "!!" in cleaned  # Réduit mais pas supprimé
    assert "§§§§§§§§§" not in cleaned  # Supprimé car trop long


def test_word_corrections():
    """Test corrections de mots français"""
    text = "C'est le ler janvier, il va a l'Ecole"
    cleaned = text_cleaner.clean_text(text)
    assert "1er" in cleaned
    assert "à l'" in cleaned
    assert "École" in cleaned


def test_fix_punctuation_guillemets():
    """Test guillemets français"""
    text = 'Il a dit "Bonjour" puis est parti'
    cleaned = text_cleaner._fix_punctuation(text)
    assert "«" in cleaned
    assert "»" in cleaned


def test_full_cleaning_pipeline():
    """Test pipeline complet de nettoyage"""
    text = """
CHAPITRE 1: Le début

Voici   un  texte mal    formaté avec des espaces   multiples.
Les œufs coûtent cher ! Vraiment ?

La documenta-
tion est importante.

Page 42
"""
    
    # Pipeline complet
    cleaned = text_cleaner.clean_text(text)
    cleaned = text_cleaner.merge_hyphenated_words(cleaned)
    cleaned = text_cleaner.remove_page_numbers(cleaned)
    cleaned = text_cleaner.clean_ocr_artifacts(cleaned)
    
    assert "documentation" in cleaned
    assert "42" not in cleaned
    assert "  " not in cleaned  # Pas d'espaces multiples
    assert "oe" in cleaned