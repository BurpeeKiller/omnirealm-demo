"""
Convertisseur audio utilisant FFmpeg
"""

import asyncio
from pathlib import Path
from typing import Optional

from omni_music.domain import AudioFormat
from omni_music.domain.exceptions import ConversionError


class FFmpegConverter:
    """Convertisseur audio basé sur FFmpeg"""

    def __init__(self, ffmpeg_path: Optional[str] = None):
        """
        Args:
            ffmpeg_path: Chemin vers l'exécutable FFmpeg (optionnel)
        """
        self.ffmpeg_path = ffmpeg_path or "ffmpeg"

    async def convert(
        self,
        source: str,
        output: str,
        format: AudioFormat,
        bitrate: Optional[int] = None
    ) -> None:
        """
        Convertit un fichier audio vers un autre format

        Args:
            source: Chemin du fichier source
            output: Chemin du fichier de sortie
            format: Format cible
            bitrate: Bitrate optionnel (utilise celui du format si non spécifié)
        """
        source_path = Path(source)
        output_path = Path(output)

        if not source_path.exists():
            raise ConversionError(
                source_format="unknown",
                target_format=format.value,
                reason=f"Source file not found: {source}"
            )

        # Construire la commande FFmpeg
        cmd = self._build_ffmpeg_command(source, output, format, bitrate)

        try:
            # Exécuter la conversion dans un processus séparé
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            stdout, stderr = await process.communicate()

            if process.returncode != 0:
                error_msg = stderr.decode() if stderr else "Unknown error"
                raise ConversionError(
                    source_format=source_path.suffix[1:],
                    target_format=format.value,
                    reason=f"FFmpeg error: {error_msg}"
                )

            if not output_path.exists():
                raise ConversionError(
                    source_format=source_path.suffix[1:],
                    target_format=format.value,
                    reason="Output file was not created"
                )

        except FileNotFoundError:
            raise ConversionError(
                source_format=source_path.suffix[1:],
                target_format=format.value,
                reason="FFmpeg not found. Please install FFmpeg."
            ) from None
        except Exception as e:
            raise ConversionError(
                source_format=source_path.suffix[1:],
                target_format=format.value,
                reason=str(e)
            ) from e

    def _build_ffmpeg_command(
        self,
        source: str,
        output: str,
        format: AudioFormat,
        bitrate: Optional[int] = None
    ) -> list[str]:
        """Construit la commande FFmpeg"""
        cmd = [self.ffmpeg_path, "-i", source, "-y"]  # -y pour écraser

        # Configuration selon le format
        if format in [AudioFormat.MP3_128, AudioFormat.MP3_192, AudioFormat.MP3_320]:
            cmd.extend(["-codec:a", "libmp3lame"])
            target_bitrate = bitrate or format.bitrate
            if target_bitrate:
                cmd.extend(["-b:a", f"{target_bitrate}k"])

        elif format == AudioFormat.FLAC:
            cmd.extend(["-codec:a", "flac"])
            cmd.extend(["-compression_level", "8"])  # Compression maximale

        elif format == AudioFormat.WAV:
            cmd.extend(["-codec:a", "pcm_s16le"])
            cmd.extend(["-ar", "44100"])  # 44.1 kHz

        elif format == AudioFormat.AAC:
            cmd.extend(["-codec:a", "aac"])
            cmd.extend(["-b:a", f"{bitrate or 256}k"])

        elif format == AudioFormat.OGG:
            cmd.extend(["-codec:a", "libvorbis"])
            cmd.extend(["-b:a", f"{bitrate or 192}k"])

        elif format == AudioFormat.OPUS:
            cmd.extend(["-codec:a", "libopus"])
            cmd.extend(["-b:a", f"{bitrate or 128}k"])

        cmd.append(output)
        return cmd

    async def is_available(self) -> bool:
        """Vérifie si FFmpeg est disponible"""
        try:
            process = await asyncio.create_subprocess_exec(
                self.ffmpeg_path, "-version",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            await process.communicate()
            return process.returncode == 0
        except FileNotFoundError:
            return False

    async def get_file_info(self, file_path: str) -> dict:
        """Récupère les informations d'un fichier audio"""
        try:
            cmd = [
                "ffprobe",
                "-v", "quiet",
                "-print_format", "json",
                "-show_format",
                "-show_streams",
                file_path
            ]

            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            stdout, stderr = await process.communicate()

            if process.returncode != 0:
                return {}

            import json
            result = json.loads(stdout.decode())
            return result if isinstance(result, dict) else {}

        except (FileNotFoundError, json.JSONDecodeError):
            return {}
