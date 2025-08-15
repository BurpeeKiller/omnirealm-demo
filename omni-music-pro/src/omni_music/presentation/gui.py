"""
Interface graphique moderne avec CustomTkinter
"""

import asyncio
import threading
from typing import Any, List, Optional

import customtkinter as ctk

from omni_music.application import (
    CreatePlaylistRequest,
    DownloadTrackRequest,
    SearchTracksRequest,
)
from omni_music.domain import AudioFormat, Track
from omni_music.infrastructure import AppConfig, Container


class OmniMusicApp:
    """Application principale avec interface graphique moderne"""

    def __init__(self, config: Optional[AppConfig] = None) -> None:
        self.config = config or AppConfig.load()
        self.container = Container(self.config)

        # Configuration CustomTkinter
        ctk.set_appearance_mode(self.config.theme)
        ctk.set_default_color_theme("dark-blue")

        # Fenêtre principale
        self.root = ctk.CTk()
        self.root.title("OmniMusic Pro")
        self.root.geometry(f"{self.config.window_size[0]}x{self.config.window_size[1]}")

        # Variables d'interface
        self.current_downloads: List[ctk.CTkFrame] = []

        # Boucle asyncio pour les opérations asynchrones
        self.loop: Optional[asyncio.AbstractEventLoop] = None
        self.loop_thread: Optional[threading.Thread] = None

        self._setup_ui()
        self._start_async_loop()

    def _setup_ui(self) -> None:
        """Configure l'interface utilisateur"""
        # Grille principale
        self.root.grid_columnconfigure(1, weight=1)
        self.root.grid_rowconfigure(0, weight=1)

        # Sidebar
        self._create_sidebar()

        # Frame principal
        self.main_frame = ctk.CTkFrame(self.root)
        self.main_frame.grid(row=0, column=1, sticky="nsew", padx=20, pady=20)
        self.main_frame.grid_columnconfigure(0, weight=1)
        self.main_frame.grid_rowconfigure(1, weight=1)

        # Onglets
        self._create_tabs()

    def _create_sidebar(self) -> None:
        """Crée la barre latérale"""
        self.sidebar = ctk.CTkFrame(self.root, width=200)
        self.sidebar.grid(row=0, column=0, sticky="nsew", padx=(20, 0), pady=20)
        self.sidebar.grid_rowconfigure(4, weight=1)

        # Logo/Titre
        title = ctk.CTkLabel(
            self.sidebar,
            text="OmniMusic Pro",
            font=ctk.CTkFont(size=20, weight="bold")
        )
        title.grid(row=0, column=0, padx=20, pady=(20, 10))

        # Boutons de navigation
        self.download_btn = ctk.CTkButton(
            self.sidebar,
            text="Télécharger",
            command=lambda: self._switch_tab("download")
        )
        self.download_btn.grid(row=1, column=0, padx=20, pady=10, sticky="ew")

        self.search_btn = ctk.CTkButton(
            self.sidebar,
            text="Rechercher",
            command=lambda: self._switch_tab("search")
        )
        self.search_btn.grid(row=2, column=0, padx=20, pady=10, sticky="ew")

        self.playlists_btn = ctk.CTkButton(
            self.sidebar,
            text="Playlists",
            command=lambda: self._switch_tab("playlists")
        )
        self.playlists_btn.grid(row=3, column=0, padx=20, pady=10, sticky="ew")

        # Paramètres
        self.settings_btn = ctk.CTkButton(
            self.sidebar,
            text="Paramètres",
            command=self._open_settings
        )
        self.settings_btn.grid(row=5, column=0, padx=20, pady=(10, 20), sticky="ew")

    def _create_tabs(self) -> None:
        """Crée les onglets principaux"""
        # Tab view
        self.tab_view = ctk.CTkTabview(self.main_frame)
        self.tab_view.grid(row=0, column=0, sticky="nsew", padx=20, pady=20)
        self.tab_view.grid_columnconfigure(0, weight=1)
        self.tab_view.grid_rowconfigure(0, weight=1)

        # Onglet Téléchargement
        self.download_tab = self.tab_view.add("Télécharger")
        self._create_download_tab()

        # Onglet Recherche
        self.search_tab = self.tab_view.add("Rechercher")
        self._create_search_tab()

        # Onglet Playlists
        self.playlists_tab = self.tab_view.add("Playlists")
        self._create_playlists_tab()

    def _create_download_tab(self) -> None:
        """Crée l'onglet de téléchargement"""
        self.download_tab.grid_columnconfigure(0, weight=1)

        # Frame d'entrée
        input_frame = ctk.CTkFrame(self.download_tab)
        input_frame.grid(row=0, column=0, sticky="ew", padx=20, pady=(20, 10))
        input_frame.grid_columnconfigure(0, weight=1)

        # Champ URL
        ctk.CTkLabel(input_frame, text="URL de la piste ou playlist :").grid(
            row=0, column=0, sticky="w", padx=20, pady=(20, 5)
        )

        self.url_entry = ctk.CTkEntry(
            input_frame,
            placeholder_text="https://www.youtube.com/watch?v=..."
        )
        self.url_entry.grid(row=1, column=0, sticky="ew", padx=20, pady=(0, 10))

        # Format et qualité
        format_frame = ctk.CTkFrame(input_frame)
        format_frame.grid(row=2, column=0, sticky="ew", padx=20, pady=(0, 20))
        format_frame.grid_columnconfigure(1, weight=1)

        ctk.CTkLabel(format_frame, text="Format :").grid(
            row=0, column=0, padx=(20, 10), pady=10
        )

        self.format_var = ctk.StringVar(value="MP3 320kbps")
        self.format_menu = ctk.CTkOptionMenu(
            format_frame,
            values=["MP3 128kbps", "MP3 192kbps", "MP3 320kbps", "FLAC", "WAV"],
            variable=self.format_var
        )
        self.format_menu.grid(row=0, column=1, padx=(0, 20), pady=10, sticky="ew")

        # Bouton de téléchargement
        self.download_start_btn = ctk.CTkButton(
            input_frame,
            text="Télécharger",
            command=self._start_download,
            height=40,
            font=ctk.CTkFont(size=16, weight="bold")
        )
        self.download_start_btn.grid(row=3, column=0, padx=20, pady=(0, 20), sticky="ew")

        # Zone de progression
        progress_frame = ctk.CTkFrame(self.download_tab)
        progress_frame.grid(row=1, column=0, sticky="nsew", padx=20, pady=(0, 20))
        progress_frame.grid_columnconfigure(0, weight=1)
        progress_frame.grid_rowconfigure(1, weight=1)
        self.download_tab.grid_rowconfigure(1, weight=1)

        ctk.CTkLabel(progress_frame, text="Téléchargements :").grid(
            row=0, column=0, sticky="w", padx=20, pady=(20, 10)
        )

        # Liste des téléchargements
        self.downloads_scrollable = ctk.CTkScrollableFrame(progress_frame)
        self.downloads_scrollable.grid(row=1, column=0, sticky="nsew", padx=20, pady=(0, 20))
        self.downloads_scrollable.grid_columnconfigure(0, weight=1)

    def _create_search_tab(self) -> None:
        """Crée l'onglet de recherche"""
        self.search_tab.grid_columnconfigure(0, weight=1)
        self.search_tab.grid_rowconfigure(1, weight=1)

        # Barre de recherche
        search_frame = ctk.CTkFrame(self.search_tab)
        search_frame.grid(row=0, column=0, sticky="ew", padx=20, pady=20)
        search_frame.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(search_frame, text="Rechercher de la musique :").grid(
            row=0, column=0, sticky="w", padx=20, pady=(20, 5)
        )

        search_input_frame = ctk.CTkFrame(search_frame)
        search_input_frame.grid(row=1, column=0, sticky="ew", padx=20, pady=(0, 20))
        search_input_frame.grid_columnconfigure(0, weight=1)

        self.search_entry = ctk.CTkEntry(
            search_input_frame,
            placeholder_text="Nom de l'artiste, titre de la chanson..."
        )
        self.search_entry.grid(row=0, column=0, sticky="ew", padx=(20, 10), pady=20)
        self.search_entry.bind("<Return>", lambda _: self._search_tracks())

        self.search_btn = ctk.CTkButton(
            search_input_frame,
            text="Rechercher",
            command=self._search_tracks,
            width=100
        )
        self.search_btn.grid(row=0, column=1, padx=(0, 20), pady=20)

        # Résultats de recherche
        self.search_results = ctk.CTkScrollableFrame(self.search_tab)
        self.search_results.grid(row=1, column=0, sticky="nsew", padx=20, pady=(0, 20))
        self.search_results.grid_columnconfigure(0, weight=1)

    def _create_playlists_tab(self) -> None:
        """Crée l'onglet des playlists"""
        self.playlists_tab.grid_columnconfigure(0, weight=1)
        self.playlists_tab.grid_rowconfigure(1, weight=1)

        # Bouton créer playlist
        create_frame = ctk.CTkFrame(self.playlists_tab)
        create_frame.grid(row=0, column=0, sticky="ew", padx=20, pady=20)

        self.create_playlist_btn = ctk.CTkButton(
            create_frame,
            text="Créer une nouvelle playlist",
            command=self._create_playlist_dialog
        )
        self.create_playlist_btn.grid(row=0, column=0, padx=20, pady=20)

        # Liste des playlists
        self.playlists_list = ctk.CTkScrollableFrame(self.playlists_tab)
        self.playlists_list.grid(row=1, column=0, sticky="nsew", padx=20, pady=(0, 20))
        self.playlists_list.grid_columnconfigure(0, weight=1)

        self._load_playlists()

    def _switch_tab(self, tab_name: str) -> None:
        """Change d'onglet"""
        self.tab_view.set(tab_name.capitalize())

    def _start_download(self) -> None:
        """Démarre un téléchargement"""
        url = self.url_entry.get().strip()
        if not url:
            self._show_error("Veuillez saisir une URL")
            return

        # Conversion du format
        format_map = {
            "MP3 128kbps": AudioFormat.MP3_128,
            "MP3 192kbps": AudioFormat.MP3_192,
            "MP3 320kbps": AudioFormat.MP3_320,
            "FLAC": AudioFormat.FLAC,
            "WAV": AudioFormat.WAV,
        }

        format_value = format_map[self.format_var.get()]

        # Créer la requête de téléchargement
        request = DownloadTrackRequest(
            url=url,
            format=format_value,
            output_dir=self.config.downloads_dir
        )

        # Lancer le téléchargement en arrière-plan
        self._run_async(self._download_track_async(request))

        # Vider le champ URL
        self.url_entry.delete(0, 'end')

    async def _download_track_async(self, request: DownloadTrackRequest) -> None:
        """Télécharge une piste de façon asynchrone"""
        try:
            # Créer un indicateur de progression
            progress_frame = self._create_download_progress(request.url)

            # Exécuter le cas d'usage
            use_case = self.container.download_track_use_case()
            response = await use_case.execute(request)

            # Mettre à jour l'interface
            if response.success:
                title = response.track.title if response.track else "Unknown"
                self._update_download_progress(progress_frame, "Terminé", title)
            else:
                error_msg = response.error_message or "Unknown error"
                self._update_download_progress(progress_frame, "Erreur", error_msg)

        except Exception as e:
            self._update_download_progress(progress_frame, "Erreur", str(e))

    def _create_download_progress(self, url: str) -> ctk.CTkFrame:
        """Crée un indicateur de progression pour un téléchargement"""
        frame = ctk.CTkFrame(self.downloads_scrollable)
        frame.grid(sticky="ew", padx=10, pady=5)
        frame.grid_columnconfigure(0, weight=1)

        # URL (tronquée)
        max_url_display_length = 60
        url_display = url[:max_url_display_length] + "..." if len(url) > max_url_display_length else url
        url_label = ctk.CTkLabel(frame, text=url_display)
        url_label.grid(row=0, column=0, sticky="w", padx=20, pady=(10, 5))

        # Barre de progression
        progress = ctk.CTkProgressBar(frame)
        progress.grid(row=1, column=0, sticky="ew", padx=20, pady=(0, 5))
        progress.set(0)  # Indéterminé pour l'instant

        # Status
        status_label = ctk.CTkLabel(frame, text="Téléchargement en cours...")
        status_label.grid(row=2, column=0, sticky="w", padx=20, pady=(0, 10))

        # Stocker les références
        frame.progress = progress
        frame.status_label = status_label
        frame.url_label = url_label

        return frame

    def _update_download_progress(self, frame: ctk.CTkFrame, status: str, details: str = "") -> None:
        """Met à jour l'indicateur de progression"""
        if status == "Terminé":
            frame.progress.set(1.0)
            frame.status_label.configure(text=f"✅ {details}")
        elif status == "Erreur":
            frame.progress.set(0)
            frame.status_label.configure(text=f"❌ {details}")
        else:
            frame.status_label.configure(text=status)

    def _search_tracks(self) -> None:
        """Recherche des pistes"""
        query = self.search_entry.get().strip()
        if not query:
            return

        # Vider les résultats précédents
        for widget in self.search_results.winfo_children():
            widget.destroy()

        # Afficher un indicateur de chargement
        loading_label = ctk.CTkLabel(self.search_results, text="Recherche en cours...")
        loading_label.grid(row=0, column=0, padx=20, pady=20)

        # Lancer la recherche
        request = SearchTracksRequest(query=query, limit=20)
        self._run_async(self._search_tracks_async(request))

    async def _search_tracks_async(self, request: SearchTracksRequest) -> None:
        """Recherche des pistes de façon asynchrone"""
        try:
            use_case = self.container.search_tracks_use_case()
            response = await use_case.execute(request)

            # Mettre à jour l'interface dans le thread principal
            self.root.after(0, lambda: self._display_search_results(response.tracks))

        except Exception as e:
            error_msg = f"Erreur de recherche: {str(e)}"
            self.root.after(0, lambda: self._show_error(error_msg))

    def _display_search_results(self, tracks: List[Track]) -> None:
        """Affiche les résultats de recherche"""
        # Vider les résultats précédents
        for widget in self.search_results.winfo_children():
            widget.destroy()

        if not tracks:
            no_results = ctk.CTkLabel(self.search_results, text="Aucun résultat trouvé")
            no_results.grid(row=0, column=0, padx=20, pady=20)
            return

        # Afficher chaque résultat
        for i, track in enumerate(tracks):
            self._create_search_result_item(track, i)

    def _create_search_result_item(self, track: Track, row: int) -> None:
        """Crée un élément de résultat de recherche"""
        item_frame = ctk.CTkFrame(self.search_results)
        item_frame.grid(row=row, column=0, sticky="ew", padx=10, pady=5)
        item_frame.grid_columnconfigure(0, weight=1)

        # Titre et artiste
        title_text = f"{track.title}"
        if track.artist:
            title_text += f" - {track.artist.name}"

        title_label = ctk.CTkLabel(
            item_frame,
            text=title_text,
            font=ctk.CTkFont(weight="bold")
        )
        title_label.grid(row=0, column=0, sticky="w", padx=20, pady=(10, 5))

        # Durée
        if track.duration_seconds > 0:
            duration_label = ctk.CTkLabel(
                item_frame,
                text=track.duration_formatted
            )
            duration_label.grid(row=1, column=0, sticky="w", padx=20, pady=(0, 10))

        # Bouton de téléchargement
        download_btn = ctk.CTkButton(
            item_frame,
            text="Télécharger",
            width=100,
            command=lambda t=track: self._download_from_search(t)
        )
        download_btn.grid(row=0, column=1, rowspan=2, padx=20, pady=10)

    def _download_from_search(self, track: Track) -> None:
        """Télécharge une piste depuis les résultats de recherche"""
        if not track.source_url:
            self._show_error("URL de la piste non disponible")
            return

        request = DownloadTrackRequest(
            url=track.source_url,
            format=AudioFormat.MP3_320,
            output_dir=self.config.downloads_dir
        )

        self._run_async(self._download_track_async(request))

        # Basculer vers l'onglet téléchargement
        self.tab_view.set("Télécharger")

    def _load_playlists(self) -> None:
        """Charge les playlists existantes"""
        # TODO: Implémenter le chargement des playlists
        placeholder = ctk.CTkLabel(
            self.playlists_list,
            text="Aucune playlist pour le moment"
        )
        placeholder.grid(row=0, column=0, padx=20, pady=20)

    def _create_playlist_dialog(self) -> None:
        """Ouvre le dialogue de création de playlist"""
        dialog = ctk.CTkToplevel(self.root)
        dialog.title("Créer une playlist")
        dialog.geometry("400x200")
        dialog.transient(self.root)
        dialog.grab_set()

        # Centrer la fenêtre
        dialog.geometry("+%d+%d" % (
            self.root.winfo_rootx() + 50,
            self.root.winfo_rooty() + 50
        ))

        # Champs
        ctk.CTkLabel(dialog, text="Nom de la playlist :").pack(pady=10)

        name_entry = ctk.CTkEntry(dialog, width=300)
        name_entry.pack(pady=5)
        name_entry.focus()

        ctk.CTkLabel(dialog, text="Description (optionnel) :").pack(pady=(20, 5))

        desc_entry = ctk.CTkTextbox(dialog, width=300, height=60)
        desc_entry.pack(pady=5)

        # Boutons
        button_frame = ctk.CTkFrame(dialog)
        button_frame.pack(pady=20, fill="x", padx=20)

        create_btn = ctk.CTkButton(
            button_frame,
            text="Créer",
            command=lambda: self._create_playlist(
                name_entry.get().strip(),
                desc_entry.get("1.0", "end-1c").strip(),
                dialog
            )
        )
        create_btn.pack(side="right", padx=10)

        cancel_btn = ctk.CTkButton(
            button_frame,
            text="Annuler",
            fg_color="gray",
            command=dialog.destroy
        )
        cancel_btn.pack(side="right")

    def _create_playlist(self, name: str, description: str, dialog: Any) -> None:
        """Crée une nouvelle playlist"""
        if not name:
            self._show_error("Le nom de la playlist est requis")
            return

        request = CreatePlaylistRequest(name=name, description=description)
        self._run_async(self._create_playlist_async(request))
        dialog.destroy()

    async def _create_playlist_async(self, request: CreatePlaylistRequest) -> None:
        """Crée une playlist de façon asynchrone"""
        try:
            use_case = self.container.create_playlist_use_case()
            response = await use_case.execute(request)

            if response.success:
                self.root.after(0, lambda: self._show_success("Playlist créée avec succès!"))
                self.root.after(0, self._load_playlists)
            else:
                error_msg = response.error_message or "Erreur inconnue"
                self.root.after(0, lambda: self._show_error(error_msg))

        except Exception as e:
            error_msg = f"Erreur: {str(e)}"
            self.root.after(0, lambda: self._show_error(error_msg))

    def _open_settings(self) -> None:
        """Ouvre la fenêtre des paramètres"""
        # TODO: Implémenter la fenêtre de paramètres
        self._show_info("Paramètres à implémenter")

    def _show_error(self, message: str) -> None:
        """Affiche un message d'erreur"""
        error_dialog = ctk.CTkToplevel(self.root)
        error_dialog.title("Erreur")
        error_dialog.geometry("400x150")
        error_dialog.transient(self.root)
        error_dialog.grab_set()

        ctk.CTkLabel(error_dialog, text="❌ " + message).pack(pady=30)
        ctk.CTkButton(error_dialog, text="OK", command=error_dialog.destroy).pack(pady=10)

    def _show_success(self, message: str) -> None:
        """Affiche un message de succès"""
        success_dialog = ctk.CTkToplevel(self.root)
        success_dialog.title("Succès")
        success_dialog.geometry("400x150")
        success_dialog.transient(self.root)
        success_dialog.grab_set()

        ctk.CTkLabel(success_dialog, text="✅ " + message).pack(pady=30)
        ctk.CTkButton(success_dialog, text="OK", command=success_dialog.destroy).pack(pady=10)

    def _show_info(self, message: str) -> None:
        """Affiche un message d'information"""
        info_dialog = ctk.CTkToplevel(self.root)
        info_dialog.title("Information")
        info_dialog.geometry("400x150")
        info_dialog.transient(self.root)
        info_dialog.grab_set()

        ctk.CTkLabel(info_dialog, text="ℹ️ " + message).pack(pady=30)
        ctk.CTkButton(info_dialog, text="OK", command=info_dialog.destroy).pack(pady=10)

    def _start_async_loop(self) -> None:
        """Démarre la boucle asyncio dans un thread séparé"""
        def run_loop() -> None:
            self.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self.loop)
            self.loop.run_forever()

        self.loop_thread = threading.Thread(target=run_loop, daemon=True)
        self.loop_thread.start()

    def _run_async(self, coro: Any) -> None:
        """Exécute une coroutine dans la boucle asyncio"""
        if self.loop:
            asyncio.run_coroutine_threadsafe(coro, self.loop)

    def run(self) -> None:
        """Lance l'application"""
        try:
            self.root.mainloop()
        finally:
            # Nettoyer la boucle asyncio
            if self.loop:
                self.loop.call_soon_threadsafe(self.loop.stop)
