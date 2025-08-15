"""
Interface graphique moderne et attractive pour OmniMusic Pro
Design professionnel avec animations et couleurs modernes
"""

import asyncio
import threading
from pathlib import Path
from typing import Any, Dict, List, Optional

import customtkinter as ctk

from omni_music.application import (
    DownloadTrackRequest,
    SearchTracksRequest,
)
from omni_music.domain import AudioFormat, Track
from omni_music.infrastructure import AppConfig, Container


class ModernOmniMusicApp:
    """Application OmniMusic avec interface moderne et attractive"""

    # Palette de couleurs moderne
    COLORS = {
        'primary': '#1f538d',      # Bleu moderne
        'secondary': '#14375e',    # Bleu foncé
        'accent': '#00d4aa',       # Vert turquoise
        'success': '#10b981',      # Vert succès
        'warning': '#f59e0b',      # Orange warning
        'error': '#ef4444',        # Rouge erreur
        'background': '#0f1419',   # Fond très sombre
        'surface': '#1a2332',      # Surface foncée
        'text_primary': '#ffffff', # Texte principal
        'text_secondary': '#94a3b8' # Texte secondaire
    }

    def __init__(self, config: Optional[AppConfig] = None) -> None:
        self.config = config or AppConfig.load()
        self.container = Container(self.config)

        # Configuration CustomTkinter avec thème moderne
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")

        # Fenêtre principale avec style moderne
        self.root = ctk.CTk()
        self.root.title("🎵 OmniMusic Pro - Music Download Manager")
        self.root.geometry("1200x800")
        self.root.minsize(800, 600)

        # Configuration de couleurs personnalisées
        self.root.configure(fg_color=self.COLORS['background'])

        # Variables d'état
        self.current_downloads: List[Dict[str, Any]] = []
        self.search_results: List[Track] = []

        # Boucle asyncio
        self.loop: Optional[asyncio.AbstractEventLoop] = None
        self.loop_thread: Optional[threading.Thread] = None

        # Créer l'interface
        self._setup_modern_ui()
        self._start_async_loop()

    def _setup_modern_ui(self) -> None:
        """Configure l'interface moderne"""

        # ===== HEADER AVEC LOGO ET TITRE =====
        self._create_header()

        # ===== CONTAINER PRINCIPAL AVEC ONGLETS =====
        self.main_container = ctk.CTkTabview(self.root, corner_radius=15)
        self.main_container.pack(fill="both", expand=True, padx=20, pady=(0, 20))

        # Onglet Recherche & Téléchargement
        self.tab_download = self.main_container.add("🔍 Recherche & Téléchargement")
        self._setup_download_tab()

        # Onglet Playlists
        self.tab_playlists = self.main_container.add("📋 Mes Playlists")
        self._setup_playlists_tab()

        # Onglet Bibliothèque
        self.tab_library = self.main_container.add("🎵 Ma Bibliothèque")
        self._setup_library_tab()

        # Onglet Paramètres
        self.tab_settings = self.main_container.add("⚙️ Paramètres")
        self._setup_settings_tab()

        # ===== STATUS BAR =====
        self._create_status_bar()

    def _create_header(self) -> None:
        """Crée l'en-tête moderne avec logo"""
        header_frame = ctk.CTkFrame(self.root, height=80, corner_radius=0)
        header_frame.pack(fill="x", padx=0, pady=0)
        header_frame.pack_propagate(False)

        # Logo et titre
        title_frame = ctk.CTkFrame(header_frame, fg_color="transparent")
        title_frame.pack(side="left", padx=20, pady=15)

        # Icône (émoji pour simplicité, on pourrait utiliser une vraie image)
        icon_label = ctk.CTkLabel(
            title_frame,
            text="🎵",
            font=ctk.CTkFont(size=32)
        )
        icon_label.pack(side="left", padx=(0, 10))

        # Titre et sous-titre
        title_container = ctk.CTkFrame(title_frame, fg_color="transparent")
        title_container.pack(side="left")

        title_label = ctk.CTkLabel(
            title_container,
            text="OmniMusic Pro",
            font=ctk.CTkFont(size=24, weight="bold"),
            text_color=self.COLORS['text_primary']
        )
        title_label.pack(anchor="w")

        subtitle_label = ctk.CTkLabel(
            title_container,
            text="Professional Music Download Manager",
            font=ctk.CTkFont(size=12),
            text_color=self.COLORS['text_secondary']
        )
        subtitle_label.pack(anchor="w")

        # Stats en temps réel (côté droit)
        self.stats_frame = ctk.CTkFrame(header_frame, fg_color="transparent")
        self.stats_frame.pack(side="right", padx=20, pady=15)

        self._create_stats_display()

    def _create_stats_display(self) -> None:
        """Affiche les statistiques en temps réel"""
        stats_container = ctk.CTkFrame(self.stats_frame, corner_radius=10)
        stats_container.pack(fill="both", expand=True)

        # Pistes téléchargées
        tracks_stat = ctk.CTkLabel(
            stats_container,
            text="📥 0 pistes",
            font=ctk.CTkFont(size=11, weight="bold")
        )
        tracks_stat.pack(side="left", padx=15, pady=10)

        # Playlists créées
        playlists_stat = ctk.CTkLabel(
            stats_container,
            text="📋 0 playlists",
            font=ctk.CTkFont(size=11, weight="bold")
        )
        playlists_stat.pack(side="left", padx=15, pady=10)

        # Status de connexion
        self.connection_status = ctk.CTkLabel(
            stats_container,
            text="🟢 En ligne",
            font=ctk.CTkFont(size=11, weight="bold"),
            text_color=self.COLORS['success']
        )
        self.connection_status.pack(side="right", padx=15, pady=10)

    def _setup_download_tab(self) -> None:
        """Configure l'onglet de téléchargement avec design moderne"""

        # ===== SECTION RECHERCHE =====
        search_section = ctk.CTkFrame(self.tab_download, corner_radius=15)
        search_section.pack(fill="x", padx=20, pady=(20, 10))

        # Titre de section avec icône
        search_title = ctk.CTkLabel(
            search_section,
            text="🔍 Rechercher de la musique",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color=self.COLORS['accent']
        )
        search_title.pack(anchor="w", padx=20, pady=(15, 10))

        # Container pour la recherche
        search_input_frame = ctk.CTkFrame(search_section, fg_color="transparent")
        search_input_frame.pack(fill="x", padx=20, pady=(0, 15))

        # Barre de recherche moderne
        self.search_entry = ctk.CTkEntry(
            search_input_frame,
            placeholder_text="🎵 Tapez le nom d'une chanson, artiste ou URL YouTube...",
            height=50,
            font=ctk.CTkFont(size=14),
            corner_radius=25
        )
        self.search_entry.pack(side="left", fill="x", expand=True, padx=(0, 15))

        # Bouton de recherche avec style moderne
        self.search_button = ctk.CTkButton(
            search_input_frame,
            text="🔍 Rechercher",
            command=self._on_search_click,
            height=50,
            width=150,
            font=ctk.CTkFont(size=14, weight="bold"),
            corner_radius=25,
            fg_color=self.COLORS['primary'],
            hover_color=self.COLORS['secondary']
        )
        self.search_button.pack(side="right")

        # Options de téléchargement
        options_frame = ctk.CTkFrame(search_section, fg_color="transparent")
        options_frame.pack(fill="x", padx=20, pady=(0, 15))

        # Sélecteur de qualité
        quality_label = ctk.CTkLabel(options_frame, text="🎚️ Qualité:", font=ctk.CTkFont(size=12))
        quality_label.pack(side="left", padx=(0, 10))

        self.quality_selector = ctk.CTkComboBox(
            options_frame,
            values=["MP3 320kbps", "MP3 192kbps", "MP3 128kbps", "FLAC", "WAV"],
            width=150,
            font=ctk.CTkFont(size=12)
        )
        self.quality_selector.set("MP3 320kbps")
        self.quality_selector.pack(side="left", padx=(0, 20))

        # Dossier de destination
        folder_label = ctk.CTkLabel(options_frame, text="📁 Dossier:", font=ctk.CTkFont(size=12))
        folder_label.pack(side="left", padx=(0, 10))

        self.folder_entry = ctk.CTkEntry(options_frame, width=200, font=ctk.CTkFont(size=11))
        self.folder_entry.insert(0, str(self.config.downloads_dir))
        self.folder_entry.pack(side="left", padx=(0, 10))

        browse_button = ctk.CTkButton(
            options_frame,
            text="📂 Parcourir",
            command=self._browse_folder,
            width=100,
            height=28
        )
        browse_button.pack(side="left")

        # ===== SECTION RÉSULTATS =====
        results_section = ctk.CTkFrame(self.tab_download, corner_radius=15)
        results_section.pack(fill="both", expand=True, padx=20, pady=10)

        results_title = ctk.CTkLabel(
            results_section,
            text="📋 Résultats de recherche",
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color=self.COLORS['text_primary']
        )
        results_title.pack(anchor="w", padx=20, pady=(15, 10))

        # Zone de résultats avec scrollbar
        self.results_scrollframe = ctk.CTkScrollableFrame(
            results_section,
            corner_radius=10,
            fg_color=self.COLORS['surface']
        )
        self.results_scrollframe.pack(fill="both", expand=True, padx=20, pady=(0, 15))

        # Message initial
        self._show_search_placeholder()

    def _show_search_placeholder(self) -> None:
        """Affiche le message de démarrage pour la recherche"""
        placeholder_frame = ctk.CTkFrame(self.results_scrollframe, fg_color="transparent")
        placeholder_frame.pack(expand=True, fill="both", pady=50)

        icon_label = ctk.CTkLabel(
            placeholder_frame,
            text="🎵",
            font=ctk.CTkFont(size=64)
        )
        icon_label.pack(pady=(0, 20))

        message_label = ctk.CTkLabel(
            placeholder_frame,
            text="Commencez par rechercher une chanson !",
            font=ctk.CTkFont(size=16),
            text_color=self.COLORS['text_secondary']
        )
        message_label.pack(pady=(0, 10))

        hint_label = ctk.CTkLabel(
            placeholder_frame,
            text="Tapez le nom d'un artiste, d'une chanson ou collez une URL YouTube",
            font=ctk.CTkFont(size=12),
            text_color=self.COLORS['text_secondary']
        )
        hint_label.pack()

    def _setup_playlists_tab(self) -> None:
        """Configure l'onglet des playlists"""
        # En-tête
        header = ctk.CTkFrame(self.tab_playlists, corner_radius=15)
        header.pack(fill="x", padx=20, pady=(20, 10))

        title = ctk.CTkLabel(
            header,
            text="📋 Gestion des Playlists",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color=self.COLORS['accent']
        )
        title.pack(side="left", padx=20, pady=15)

        new_playlist_btn = ctk.CTkButton(
            header,
            text="➕ Nouvelle Playlist",
            command=self._create_new_playlist,
            height=40,
            font=ctk.CTkFont(size=12, weight="bold"),
            fg_color=self.COLORS['success'],
            hover_color=self.COLORS['primary']
        )
        new_playlist_btn.pack(side="right", padx=20, pady=15)

        # Liste des playlists
        self.playlists_frame = ctk.CTkScrollableFrame(
            self.tab_playlists,
            corner_radius=15
        )
        self.playlists_frame.pack(fill="both", expand=True, padx=20, pady=10)

        self._load_playlists()

    def _setup_library_tab(self) -> None:
        """Configure l'onglet bibliothèque"""
        # En-tête avec filtres
        header = ctk.CTkFrame(self.tab_library, corner_radius=15)
        header.pack(fill="x", padx=20, pady=(20, 10))

        title = ctk.CTkLabel(
            header,
            text="🎵 Ma Bibliothèque Musicale",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color=self.COLORS['accent']
        )
        title.pack(side="left", padx=20, pady=15)

        # Barre de recherche dans la bibliothèque
        search_library = ctk.CTkEntry(
            header,
            placeholder_text="🔍 Filtrer ma bibliothèque...",
            width=250,
            height=35
        )
        search_library.pack(side="right", padx=20, pady=15)

        # Liste des pistes
        self.library_frame = ctk.CTkScrollableFrame(
            self.tab_library,
            corner_radius=15
        )
        self.library_frame.pack(fill="both", expand=True, padx=20, pady=10)

        self._load_library()

    def _setup_settings_tab(self) -> None:
        """Configure l'onglet paramètres"""
        settings_container = ctk.CTkFrame(self.tab_settings, corner_radius=15)
        settings_container.pack(fill="both", expand=True, padx=20, pady=20)

        title = ctk.CTkLabel(
            settings_container,
            text="⚙️ Paramètres & Configuration",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color=self.COLORS['accent']
        )
        title.pack(anchor="w", padx=20, pady=(20, 30))

        # Paramètres de téléchargement
        download_section = ctk.CTkFrame(settings_container)
        download_section.pack(fill="x", padx=20, pady=(0, 20))

        ctk.CTkLabel(
            download_section,
            text="📥 Téléchargements",
            font=ctk.CTkFont(size=14, weight="bold")
        ).pack(anchor="w", padx=15, pady=(15, 10))

        # Qualité par défaut
        quality_frame = ctk.CTkFrame(download_section, fg_color="transparent")
        quality_frame.pack(fill="x", padx=15, pady=5)

        ctk.CTkLabel(quality_frame, text="Qualité par défaut:").pack(side="left")
        default_quality = ctk.CTkComboBox(
            quality_frame,
            values=["MP3 320kbps", "MP3 192kbps", "FLAC"]
        )
        default_quality.pack(side="right", padx=(10, 0))

        # Dossier par défaut
        folder_frame = ctk.CTkFrame(download_section, fg_color="transparent")
        folder_frame.pack(fill="x", padx=15, pady=(5, 15))

        ctk.CTkLabel(folder_frame, text="Dossier par défaut:").pack(side="left")
        default_folder = ctk.CTkEntry(folder_frame, width=200)
        default_folder.insert(0, str(self.config.downloads_dir))
        default_folder.pack(side="right", padx=(10, 0))

        # Section Apparence
        appearance_section = ctk.CTkFrame(settings_container)
        appearance_section.pack(fill="x", padx=20, pady=(0, 20))

        ctk.CTkLabel(
            appearance_section,
            text="🎨 Apparence",
            font=ctk.CTkFont(size=14, weight="bold")
        ).pack(anchor="w", padx=15, pady=(15, 10))

        theme_frame = ctk.CTkFrame(appearance_section, fg_color="transparent")
        theme_frame.pack(fill="x", padx=15, pady=(5, 15))

        ctk.CTkLabel(theme_frame, text="Thème:").pack(side="left")
        theme_selector = ctk.CTkComboBox(
            theme_frame,
            values=["Dark", "Light", "System"]
        )
        theme_selector.set("Dark")
        theme_selector.pack(side="right", padx=(10, 0))

    def _create_status_bar(self) -> None:
        """Crée la barre de statut moderne"""
        self.status_bar = ctk.CTkFrame(self.root, height=35, corner_radius=0)
        self.status_bar.pack(fill="x", side="bottom")
        self.status_bar.pack_propagate(False)

        # Status principal
        self.status_label = ctk.CTkLabel(
            self.status_bar,
            text="✅ Prêt à télécharger de la musique",
            font=ctk.CTkFont(size=11),
            text_color=self.COLORS['success']
        )
        self.status_label.pack(side="left", padx=15, pady=5)

        # Barre de progression
        self.progress_bar = ctk.CTkProgressBar(
            self.status_bar,
            width=200,
            height=10
        )
        self.progress_bar.pack(side="right", padx=15, pady=5)
        self.progress_bar.set(0)

    # ===== EVENT HANDLERS =====

    def _on_search_click(self) -> None:
        """Gère le clic sur recherche"""
        query = self.search_entry.get().strip()
        if not query:
            self._update_status("⚠️ Veuillez saisir un terme de recherche", "warning")
            return

        self._update_status("🔍 Recherche en cours...", "info")
        self.search_button.configure(state="disabled", text="🔍 Recherche...")

        # Lancer la recherche async
        if self.loop:
            asyncio.run_coroutine_threadsafe(self._perform_search(query), self.loop)

    async def _perform_search(self, query: str) -> None:
        """Effectue la recherche de façon asynchrone"""
        try:
            search_use_case = self.container.search_tracks_use_case()
            request = SearchTracksRequest(query=query, limit=10)

            response = await search_use_case.execute(request)

            # Mettre à jour l'UI dans le thread principal
            self.root.after(0, self._display_search_results, response.tracks)
            self.root.after(0, self._update_status, f"✅ {len(response.tracks)} résultats trouvés", "success")

        except Exception as e:
            self.root.after(0, self._update_status, f"❌ Erreur: {str(e)}", "error")
        finally:
            self.root.after(0, self._reset_search_button)

    def _display_search_results(self, tracks: List[Track]) -> None:
        """Affiche les résultats de recherche"""
        # Nettoyer les anciens résultats
        for widget in self.results_scrollframe.winfo_children():
            widget.destroy()

        if not tracks:
            self._show_no_results()
            return

        for i, track in enumerate(tracks):
            self._create_track_card(track, i)

    def _create_track_card(self, track: Track, _index: int) -> None:
        """Crée une carte moderne pour une piste"""
        card = ctk.CTkFrame(
            self.results_scrollframe,
            corner_radius=10,
            height=80
        )
        card.pack(fill="x", padx=5, pady=5)
        card.pack_propagate(False)

        # Informations de la piste
        info_frame = ctk.CTkFrame(card, fg_color="transparent")
        info_frame.pack(side="left", fill="both", expand=True, padx=15, pady=10)

        title_label = ctk.CTkLabel(
            info_frame,
            text=track.title,
            font=ctk.CTkFont(size=14, weight="bold"),
            anchor="w"
        )
        title_label.pack(anchor="w")

        artist_label = ctk.CTkLabel(
            info_frame,
            text=f"👤 {track.artist.name if track.artist else 'Artiste inconnu'}",
            font=ctk.CTkFont(size=11),
            text_color=self.COLORS['text_secondary'],
            anchor="w"
        )
        artist_label.pack(anchor="w", pady=(2, 0))

        duration_text = f"⏱️ {int(track.duration_seconds) // 60}:{int(track.duration_seconds) % 60:02d}" if track.duration_seconds else "⏱️ --:--"
        duration_label = ctk.CTkLabel(
            info_frame,
            text=duration_text,
            font=ctk.CTkFont(size=10),
            text_color=self.COLORS['text_secondary'],
            anchor="w"
        )
        duration_label.pack(anchor="w", pady=(2, 0))

        # Bouton de téléchargement
        download_btn = ctk.CTkButton(
            card,
            text="⬇️ Télécharger",
            command=lambda t=track: self._download_track(t),
            width=120,
            height=35,
            font=ctk.CTkFont(size=11, weight="bold"),
            fg_color=self.COLORS['accent'],
            hover_color=self.COLORS['primary']
        )
        download_btn.pack(side="right", padx=15, pady=10)

    def _download_track(self, track: Track) -> None:
        """Lance le téléchargement d'une piste"""
        self._update_status(f"📥 Téléchargement de '{track.title}'...", "info")

        if self.loop:
            asyncio.run_coroutine_threadsafe(self._perform_download(track), self.loop)

    async def _perform_download(self, track: Track) -> None:
        """Effectue le téléchargement de façon asynchrone"""
        try:
            download_use_case = self.container.download_track_use_case()

            # Convertir la qualité sélectionnée
            quality_map = {
                "MP3 320kbps": AudioFormat.MP3_320,
                "MP3 192kbps": AudioFormat.MP3_192,
                "MP3 128kbps": AudioFormat.MP3_128,
                "FLAC": AudioFormat.FLAC,
                "WAV": AudioFormat.WAV
            }

            format = quality_map.get(self.quality_selector.get(), AudioFormat.MP3_320)

            request = DownloadTrackRequest(
                url=track.source_url,
                format=format,
                output_dir=Path(self.folder_entry.get())
            )

            response = await download_use_case.execute(request)

            if response.success:
                self.root.after(0, self._update_status, f"✅ '{track.title}' téléchargé avec succès", "success")
            else:
                self.root.after(0, self._update_status, f"❌ Échec téléchargement: {response.error_message}", "error")

        except Exception as e:
            self.root.after(0, self._update_status, f"❌ Erreur: {str(e)}", "error")

    def _update_status(self, message: str, status_type: str = "info") -> None:
        """Met à jour la barre de statut avec couleur"""
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

    def _reset_search_button(self) -> None:
        """Remet le bouton de recherche à l'état initial"""
        self.search_button.configure(state="normal", text="🔍 Rechercher")

    def _show_no_results(self) -> None:
        """Affiche un message quand aucun résultat"""
        no_results_frame = ctk.CTkFrame(self.results_scrollframe, fg_color="transparent")
        no_results_frame.pack(expand=True, fill="both", pady=50)

        icon_label = ctk.CTkLabel(
            no_results_frame,
            text="😔",
            font=ctk.CTkFont(size=48)
        )
        icon_label.pack(pady=(0, 15))

        message_label = ctk.CTkLabel(
            no_results_frame,
            text="Aucun résultat trouvé",
            font=ctk.CTkFont(size=16, weight="bold")
        )
        message_label.pack(pady=(0, 8))

        hint_label = ctk.CTkLabel(
            no_results_frame,
            text="Essayez avec des mots-clés différents ou une URL YouTube",
            font=ctk.CTkFont(size=12),
            text_color=self.COLORS['text_secondary']
        )
        hint_label.pack()

    def _browse_folder(self) -> None:
        """Ouvre le sélecteur de dossier"""
        import tkinter.filedialog as fd
        folder = fd.askdirectory(initialdir=self.folder_entry.get())
        if folder:
            self.folder_entry.delete(0, "end")
            self.folder_entry.insert(0, folder)

    def _create_new_playlist(self) -> None:
        """Ouvre la dialog de création de playlist"""
        # TODO: Implémenter la création de playlist
        self._update_status("🚧 Création de playlist en développement", "info")

    def _load_playlists(self) -> None:
        """Charge les playlists existantes"""
        # Placeholder pour les playlists
        placeholder = ctk.CTkLabel(
            self.playlists_frame,
            text="📋 Vos playlists apparaîtront ici",
            font=ctk.CTkFont(size=14),
            text_color=self.COLORS['text_secondary']
        )
        placeholder.pack(pady=50)

    def _load_library(self) -> None:
        """Charge la bibliothèque musicale"""
        # Placeholder pour la bibliothèque
        placeholder = ctk.CTkLabel(
            self.library_frame,
            text="🎵 Votre bibliothèque musicale apparaîtra ici",
            font=ctk.CTkFont(size=14),
            text_color=self.COLORS['text_secondary']
        )
        placeholder.pack(pady=50)

    def _start_async_loop(self) -> None:
        """Démarre la boucle asyncio dans un thread séparé"""
        def run_loop():
            self.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self.loop)
            self.loop.run_forever()

        self.loop_thread = threading.Thread(target=run_loop, daemon=True)
        self.loop_thread.start()

    def run(self) -> None:
        """Lance l'application"""
        try:
            self.root.mainloop()
        finally:
            if self.loop:
                self.loop.call_soon_threadsafe(self.loop.stop)


def main() -> None:
    """Point d'entrée principal"""
    app = ModernOmniMusicApp()
    app.run()


if __name__ == "__main__":
    main()
