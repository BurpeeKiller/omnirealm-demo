#!/usr/bin/env python3
"""Script de test pour l'upload OmniScan"""

import requests
import sys
from pathlib import Path

def test_upload(file_path):
    """Tester l'upload d'un fichier"""
    
    url = "http://localhost:8001/api/v1/upload"
    
    # Vérifier que le fichier existe
    if not Path(file_path).exists():
        print(f"❌ Fichier non trouvé : {file_path}")
        return
    
    # Préparer le fichier
    with open(file_path, 'rb') as f:
        files = {'file': (Path(file_path).name, f, 'image/png')}
        
        print(f"📤 Upload de {file_path}...")
        
        try:
            # Envoyer la requête
            response = requests.post(url, files=files)
            
            if response.status_code == 202:
                print("✅ Upload réussi !")
                print(f"📄 Réponse : {response.json()}")
            else:
                print(f"❌ Erreur {response.status_code}")
                print(f"📄 Détails : {response.json()}")
                
        except Exception as e:
            print(f"❌ Erreur de connexion : {e}")
            print("Vérifiez que le backend est démarré sur http://localhost:8001")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        test_upload(sys.argv[1])
    else:
        # Utiliser l'image de test
        test_upload("/tmp/test-omniscan.png")