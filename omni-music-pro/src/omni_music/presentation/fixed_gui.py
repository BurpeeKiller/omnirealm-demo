"""
Interface corrigée avec gestion simplifiée des threads
Version stable sans bugs d'affichage
"""

import asyncio
import threading
import tkinter as tk
from pathlib import Path
from typing import List, Optional

import customtkinter as ctk

from omni_music.application import (
    DownloadTrackRequest,
    SearchTracksRequest,
)
from omni_music.domain import AudioFormat, Track
from omni_music.infrastructure import AppConfig, Container


class FixedOmniMusicApp:
    """Version corrigée de l'interface OmniMusic"""

    # Couleurs modernes
    COLORS = {
        'primary': '#1f538d',
        'secondary': '#14375e',
        'accent': '#00d4aa',
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'background': '#0f1419',
        'surface': '#1a2332',
        'text_primary': '#ffffff',
        'text_secondary': '#94a3b8'
    }

    def __init__(self, config: Optional[AppConfig] = None) -> None:
        self.config = config or AppConfig.load()
        self.container = Container(self.config)

        # Configuration CustomTkinter
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")

        # Fenêtre principale
        self.root = ctk.CTk()
        self.root.title("🎵 OmniMusic Pro - Fixed Version")
        self.root.geometry("1000x700")
        self.root.minsize(800, 600)

        # Variables d'état
        self.current_tracks: List[Track] = []
        self.is_searching = False

        # Créer l'interface
        self._setup_ui()

    def _setup_ui(self) -> None:
        """Configure l'interface utilisateur fixée"""

        # Header
        self._create_header()

        # Container principal
        main_container = ctk.CTkFrame(self.root)
        main_container.pack(fill="both", expand=True, padx=20, pady=(0, 20))

        # Section recherche
        self._create_search_section(main_container)

        # Section résultats
        self._create_results_section(main_container)

        # Status bar
        self._create_status_bar()

    def _create_header(self) -> None:
        """Crée l'en-tête"""
        header = ctk.CTkFrame(self.root, height=70)
        header.pack(fill="x", padx=0, pady=0)
        header.pack_propagate(False)

        # Titre
        title_frame = ctk.CTkFrame(header, fg_color="transparent")
        title_frame.pack(side="left", padx=20, pady=15)

        icon_label = ctk.CTkLabel(title_frame, text="🎵", font=ctk.CTkFont(size=28))
        icon_label.pack(side="left", padx=(0, 10))

        title_label = ctk.CTkLabel(
            title_frame,
            text="OmniMusic Pro",
            font=ctk.CTkFont(size=20, weight="bold")
        )
        title_label.pack(side="left")

        # Version indicator
        version_label = ctk.CTkLabel(
            header,
            text="v2.0 - Fixed",
            font=ctk.CTkFont(size=10),
            text_color=self.COLORS['accent']
        )
        version_label.pack(side="right", padx=20, pady=15)

    def _create_search_section(self, parent) -> None:
        """Crée la section de recherche"""
        search_frame = ctk.CTkFrame(parent)
        search_frame.pack(fill="x", padx=20, pady=(20, 10))

        # Titre
        search_title = ctk.CTkLabel(
            search_frame,
            text="🔍 Rechercher de la musique",
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color=self.COLORS['accent']
        )
        search_title.pack(anchor="w", padx=20, pady=(15, 10))

        # Container de recherche
        search_container = ctk.CTkFrame(search_frame, fg_color="transparent")
        search_container.pack(fill="x", padx=20, pady=(0, 15))

        # Entry de recherche
        self.search_entry = ctk.CTkEntry(
            search_container,
            placeholder_text="🎵 Nom d'artiste, chanson ou URL YouTube...",
            height=40,
            font=ctk.CTkFont(size=12)
        )
        self.search_entry.pack(side="left", fill="x", expand=True, padx=(0, 10))

        # Bind Enter key
        self.search_entry.bind("<Return>", lambda _: self._start_search())

        # Bouton recherche
        self.search_button = ctk.CTkButton(
            search_container,
            text="🔍 Rechercher",
            command=self._start_search,
            height=40,
            width=120,
            font=ctk.CTkFont(size=12, weight="bold")
        )
        self.search_button.pack(side="right")

        # Options
        options_frame = ctk.CTkFrame(search_frame, fg_color="transparent")
        options_frame.pack(fill="x", padx=20, pady=(0, 15))

        # Sélecteur qualité
        quality_label = ctk.CTkLabel(options_frame, text="🎚️ Qualité:")
        quality_label.pack(side="left", padx=(0, 5))

        self.quality_var = tk.StringVar(value="MP3 320kbps")
        self.quality_selector = ctk.CTkComboBox(
            options_frame,
            values=["MP3 320kbps", "MP3 192kbps", "MP3 128kbps", "FLAC"],
            variable=self.quality_var,
            width=140
        )
        self.quality_selector.pack(side="left", padx=(0, 20))

        # Dossier
        folder_label = ctk.CTkLabel(options_frame, text="📁 Dossier:")
        folder_label.pack(side="left", padx=(0, 5))

        self.folder_var = tk.StringVar(value=str(self.config.downloads_dir))
        self.folder_entry = ctk.CTkEntry(options_frame, textvariable=self.folder_var, width=200)
        self.folder_entry.pack(side="left", padx=(0, 10))

        browse_btn = ctk.CTkButton(options_frame, text="📂", width=30, command=self._browse_folder)
        browse_btn.pack(side="left")

    def _create_results_section(self, parent) -> None:
        """Crée la section des résultats"""
        results_frame = ctk.CTkFrame(parent)
        results_frame.pack(fill="both", expand=True, padx=20, pady=10)

        # En-tête résultats
        results_header = ctk.CTkFrame(results_frame, fg_color="transparent")
        results_header.pack(fill="x", padx=20, pady=(15, 10))

        self.results_title = ctk.CTkLabel(
            results_header,
            text="📋 Résultats de recherche",
            font=ctk.CTkFont(size=14, weight="bold")
        )
        self.results_title.pack(side="left")

        self.results_count = ctk.CTkLabel(
            results_header,
            text="",
            font=ctk.CTkFont(size=11),
            text_color=self.COLORS['text_secondary']
        )
        self.results_count.pack(side="right")

        # Zone des résultats avec ScrollableFrame fixé
        self.results_container = ctk.CTkScrollableFrame(
            results_frame,
            corner_radius=10,
            fg_color=self.COLORS['surface'],
            height=400  # Hauteur fixe pour éviter les problèmes
        )
        self.results_container.pack(fill="both", expand=True, padx=20, pady=(0, 15))

        # Message initial
        self._show_initial_message()

    def _create_status_bar(self) -> None:
        """Crée la barre de statut"""
        self.status_frame = ctk.CTkFrame(self.root, height=30)
        self.status_frame.pack(fill="x", side="bottom")
        self.status_frame.pack_propagate(False)

        self.status_label = ctk.CTkLabel(
            self.status_frame,
            text="✅ Prêt - Tapez votre recherche",
            font=ctk.CTkFont(size=10)
        )
        self.status_label.pack(side="left", padx=15, pady=5)

        # Indicateur de chargement
        self.loading_label = ctk.CTkLabel(
            self.status_frame,
            text="",
            font=ctk.CTkFont(size=10),
            text_color=self.COLORS['accent']
        )
        self.loading_label.pack(side="right", padx=15, pady=5)

    def _show_initial_message(self) -> None:
        """Affiche le message initial"""
        # Nettoyer
        for widget in self.results_container.winfo_children():
            widget.destroy()

        placeholder = ctk.CTkFrame(self.results_container, fg_color="transparent")
        placeholder.pack(expand=True, fill="both", pady=100)

        icon = ctk.CTkLabel(placeholder, text="🎵", font=ctk.CTkFont(size=48))
        icon.pack(pady=(0, 15))

        message = ctk.CTkLabel(
            placeholder,
            text="Recherchez votre musique préférée !",
            font=ctk.CTkFont(size=14, weight="bold")
        )
        message.pack(pady=(0, 8))

        hint = ctk.CTkLabel(
            placeholder,
            text="Artiste, chanson ou URL YouTube • Appuyez Entrée pour rechercher",
            font=ctk.CTkFont(size=11),
            text_color=self.COLORS['text_secondary']
        )
        hint.pack()

    def _start_search(self) -> None:
        """Démarre une recherche (version simplifiée sans asyncio complexe)"""
        query = self.search_entry.get().strip()

        if not query:
            self._update_status("⚠️ Veuillez saisir un terme de recherche", "warning")
            return

        if self.is_searching:
            self._update_status("⏳ Recherche en cours, patientez...", "info")
            return

        # UI feedback immédiat
        self.is_searching = True
        self.search_button.configure(state="disabled", text="🔍 Recherche...")
        self._update_status("🔍 Recherche en cours...", "info")
        self.loading_label.configure(text="⏳")

        # Lancer la recherche dans un thread séparé
        thread = threading.Thread(target=self._perform_search_thread, args=(query,))
        thread.daemon = True
        thread.start()

    def _perform_search_thread(self, query: str) -> None:
        """Effectue la recherche dans un thread séparé"""
        try:
            print(f"🔍 Démarrage recherche pour: {query}")

            # Créer un nouvel event loop pour ce thread
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

            try:
                # Effectuer la recherche
                search_use_case = self.container.search_tracks_use_case()
                request = SearchTracksRequest(query=query, limit=10)

                response = loop.run_until_complete(search_use_case.execute(request))

                print(f"✅ Recherche terminée: {len(response.tracks)} résultats")

                # Mettre à jour l'interface dans le thread principal
                self.root.after(0, self._display_results, response.tracks, query)

            finally:
                loop.close()

        except Exception as e:
            print(f"❌ Erreur de recherche: {e}")
            import traceback
            traceback.print_exc()

            # Signaler l'erreur à l'interface
            self.root.after(0, self._search_error, str(e))

    def _display_results(self, tracks: List[Track], query: str) -> None:
        """Affiche les résultats (appelé dans le thread principal)"""
        print(f"📺 Affichage de {len(tracks)} résultats")

        # Sauvegarder les tracks
        self.current_tracks = tracks

        # Nettoyer les anciens résultats
        for widget in self.results_container.winfo_children():
            widget.destroy()

        # Mettre à jour le compteur
        self.results_count.configure(text=f"{len(tracks)} résultats")

        if not tracks:
            self._show_no_results(query)
        else:
            # Créer les cartes de résultats
            for i, track in enumerate(tracks):
                self._create_track_card(track, i)
                print(f"  ✅ Carte créée pour: {track.title}")

        # Remettre l'interface en état normal
        self._search_completed()

    def _create_track_card(self, track: Track, _index: int) -> None:
        """Crée une carte pour une piste (version simplifiée et robuste)"""
        print(f"🎨 Création carte pour: {track.title}")

        # Frame principale de la carte
        card = ctk.CTkFrame(self.results_container, height=70, corner_radius=8)
        card.pack(fill="x", padx=10, pady=5)
        card.pack_propagate(False)

        # Frame pour les infos (côté gauche)
        info_frame = ctk.CTkFrame(card, fg_color="transparent")
        info_frame.pack(side="left", fill="both", expand=True, padx=15, pady=10)

        # Titre de la piste
        max_title_length = 50
        title_text = track.title if len(track.title) <= max_title_length else track.title[:47] + "..."
        title_label = ctk.CTkLabel(
            info_frame,
            text=title_text,
            font=ctk.CTkFont(size=12, weight="bold"),
            anchor="w"
        )
        title_label.pack(anchor="w")

        # Artiste et durée
        artist_name = track.artist.name if track.artist else "Artiste inconnu"
        duration_str = f"{track.duration_seconds // 60}:{track.duration_seconds % 60:02d}" if track.duration_seconds else "--:--"

        details_text = f"👤 {artist_name} • ⏱️ {duration_str}"
        details_label = ctk.CTkLabel(
            info_frame,
            text=details_text,
            font=ctk.CTkFont(size=10),
            text_color=self.COLORS['text_secondary'],
            anchor="w"
        )
        details_label.pack(anchor="w", pady=(3, 0))

        # Bouton de téléchargement (côté droit)
        # Utiliser une fonction closure pour capturer la track
        def create_download_callback(track_to_download):
            return lambda: self._start_download(track_to_download)

        download_btn = ctk.CTkButton(
            card,
            text="⬇️ Télécharger",
            command=create_download_callback(track),
            width=110,
            height=35,
            font=ctk.CTkFont(size=11, weight="bold"),
            fg_color=self.COLORS['accent'],
            hover_color=self.COLORS['primary']
        )
        download_btn.pack(side="right", padx=15, pady=10)

        print(f"  ✅ Carte complète pour: {track.title}")

    def _start_download(self, track: Track) -> None:
        """Démarre le téléchargement d'une piste"""
        print(f"🔥 TÉLÉCHARGEMENT DEMANDÉ: {track.title}")
        print(f"   URL: {track.source_url}")
        print(f"   Format: {self.quality_var.get()}")
        print(f"   Dossier: {self.folder_var.get()}")

        self._update_status(f"📥 Téléchargement de '{track.title}'...", "info")

        # Lancer le téléchargement dans un thread
        thread = threading.Thread(target=self._perform_download_thread, args=(track,))
        thread.daemon = True
        thread.start()

    def _perform_download_thread(self, track: Track) -> None:
        """Effectue le téléchargement dans un thread séparé"""
        try:
            print(f"📥 Démarrage téléchargement de: {track.title}")

            # Créer un nouvel event loop
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

            try:
                download_use_case = self.container.download_track_use_case()

                # Convertir la qualité
                quality_map = {
                    "MP3 320kbps": AudioFormat.MP3_320,
                    "MP3 192kbps": AudioFormat.MP3_192,
                    "MP3 128kbps": AudioFormat.MP3_128,
                    "FLAC": AudioFormat.FLAC
                }

                format = quality_map.get(self.quality_var.get(), AudioFormat.MP3_320)

                request = DownloadTrackRequest(
                    url=track.source_url,
                    format=format,
                    output_dir=Path(self.folder_var.get())
                )

                response = loop.run_until_complete(download_use_case.execute(request))

                # Mettre à jour l'interface
                if response.success:
                    message = f"✅ '{track.title}' téléchargé avec succès!"
                    self.root.after(0, self._update_status, message, "success")
                    print(f"✅ Téléchargement réussi: {response.file_path}")
                else:
                    message = f"❌ Échec: {response.error_message}"
                    self.root.after(0, self._update_status, message, "error")
                    print(f"❌ Téléchargement échoué: {response.error_message}")

            finally:
                loop.close()

        except Exception as e:
            print(f"❌ Erreur téléchargement: {e}")
            message = f"❌ Erreur lors du téléchargement: {str(e)}"
            self.root.after(0, self._update_status, message, "error")

    def _search_error(self, error_message: str) -> None:
        """Gère les erreurs de recherche"""
        print(f"❌ Erreur de recherche: {error_message}")

        self._update_status(f"❌ Erreur de recherche: {error_message}", "error")
        self._search_completed()

        # Afficher un message d'erreur
        for widget in self.results_container.winfo_children():
            widget.destroy()

        error_frame = ctk.CTkFrame(self.results_container, fg_color="transparent")
        error_frame.pack(expand=True, fill="both", pady=100)

        icon = ctk.CTkLabel(error_frame, text="❌", font=ctk.CTkFont(size=48))
        icon.pack(pady=(0, 15))

        message = ctk.CTkLabel(
            error_frame,
            text="Erreur de recherche",
            font=ctk.CTkFont(size=14, weight="bold")
        )
        message.pack(pady=(0, 8))

        details = ctk.CTkLabel(
            error_frame,
            text=error_message,
            font=ctk.CTkFont(size=11),
            text_color=self.COLORS['error']
        )
        details.pack()

    def _show_no_results(self, query: str) -> None:
        """Affiche le message aucun résultat"""
        no_results_frame = ctk.CTkFrame(self.results_container, fg_color="transparent")
        no_results_frame.pack(expand=True, fill="both", pady=100)

        icon = ctk.CTkLabel(no_results_frame, text="😔", font=ctk.CTkFont(size=48))
        icon.pack(pady=(0, 15))

        message = ctk.CTkLabel(
            no_results_frame,
            text=f"Aucun résultat pour '{query}'",
            font=ctk.CTkFont(size=14, weight="bold")
        )
        message.pack(pady=(0, 8))

        hint = ctk.CTkLabel(
            no_results_frame,
            text="Essayez avec d'autres mots-clés ou une URL YouTube",
            font=ctk.CTkFont(size=11),
            text_color=self.COLORS['text_secondary']
        )
        hint.pack()

    def _search_completed(self) -> None:
        """Remet l'interface en état après une recherche"""
        self.is_searching = False
        self.search_button.configure(state="normal", text="🔍 Rechercher")
        self.loading_label.configure(text="")

    def _update_status(self, message: str, status_type: str = "info") -> None:
        """Met à jour la barre de statut"""
        color_map = {
            "success": self.COLORS['success'],
            "error": self.COLORS['error'],
            "warning": self.COLORS['warning'],
            "info": self.COLORS['text_primary']
        }

        self.status_label.configure(
            text=message,
            text_color=color_map.get(status_type, self.COLORS['text_primary'])
        )

        print(f"📊 Status: {message}")

    def _browse_folder(self) -> None:
        """Ouvre le sélecteur de dossier"""
        import tkinter.filedialog as fd
        folder = fd.askdirectory(initialdir=self.folder_var.get())
        if folder:
            self.folder_var.set(folder)

    def run(self) -> None:
        """Lance l'application"""
        print("🚀 Lancement OmniMusic Pro - Version Corrigée")
        try:
            self.root.mainloop()
        except KeyboardInterrupt:
            print("⏹️  Application fermée par l'utilisateur")
        except Exception as e:
            print(f"❌ Erreur application: {e}")


def main() -> None:
    """Point d'entrée principal"""
    app = FixedOmniMusicApp()
    app.run()


if __name__ == "__main__":
    main()
