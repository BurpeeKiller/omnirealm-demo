// Générateur d'icônes avec Canvas pour PWA
export const generateIconPNG = (size: number): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = size;
    canvas.height = size;

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#F97316');

    // Background circle
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 8, 0, 2 * Math.PI);
    ctx.fill();

    // Inner circle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 24, 0, 2 * Math.PI);
    ctx.stroke();

    // Central "F" for Fitness
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = `bold ${size * 0.3}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💪', size / 2, size / 2);

    // Exercise icons as text emojis (plus lisible)
    const iconSize = size * 0.08;
    ctx.font = `${iconSize}px Arial`;

    // Burpees (top)
    ctx.fillText('🔥', size / 2, size / 2 - size * 0.2);

    // Pushups (bottom left)
    ctx.fillText('💪', size / 2 - size * 0.15, size / 2 + size * 0.15);

    // Squats (bottom right)
    ctx.fillText('🦵', size / 2 + size * 0.15, size / 2 + size * 0.15);

    // Convert to blob
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
};

// Utilitaire pour télécharger l'icône
export const downloadIcon = async (size: number, filename: string) => {
  const blob = await generateIconPNG(size);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// Générer toutes les icônes PWA
export const generateAllIcons = async () => {
  console.log('Generating PWA icons...');

  // Icône 192x192
  await downloadIcon(192, 'icon-192.png');

  // Icône 512x512
  await downloadIcon(512, 'icon-512.png');

  // Favicon
  await downloadIcon(48, 'favicon.png');

  console.log('✅ All icons generated and downloaded!');
};
