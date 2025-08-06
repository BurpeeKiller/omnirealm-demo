import fs from 'fs';
import path from 'path';

// Générateur d'icônes SVG pour PWA
const generateIcon = (size) => {
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient background -->
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F97316;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0.7" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 8}" fill="url(#bg)" />
  
  <!-- Inner circle -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 24}" fill="none" stroke="url(#accent)" stroke-width="3" opacity="0.8"/>
  
  <!-- Exercise icons -->
  <!-- Burpees icon (top) -->
  <g transform="translate(${size / 2 - 12}, ${size / 2 - 40})">
    <circle cx="12" cy="8" r="3" fill="url(#accent)"/>
    <rect x="8" y="12" width="8" height="12" rx="2" fill="url(#accent)"/>
  </g>
  
  <!-- Pushups icon (bottom left) -->
  <g transform="translate(${size / 2 - 35}, ${size / 2 + 15})">
    <circle cx="8" cy="4" r="2.5" fill="url(#accent)"/>
    <rect x="3" y="7" width="10" height="8" rx="2" fill="url(#accent)"/>
  </g>
  
  <!-- Squats icon (bottom right) -->
  <g transform="translate(${size / 2 + 15}, ${size / 2 + 15})">
    <circle cx="8" cy="4" r="2.5" fill="url(#accent)"/>
    <rect x="6" y="7" width="4" height="10" rx="1" fill="url(#accent)"/>
    <rect x="2" y="13" width="12" height="4" rx="2" fill="url(#accent)"/>
  </g>
  
  <!-- Central "F" for Fitness -->
  <text x="${size / 2}" y="${size / 2 + 6}" font-family="Arial, sans-serif" font-size="${size * 0.15}" 
        font-weight="bold" text-anchor="middle" fill="url(#accent)">F</text>
</svg>`;

  return svg.trim();
};

// Fonction pour convertir SVG en PNG (simulation, en réalité il faudrait un outil comme sharp)
const saveSVGAsIcon = (svg, filename, size) => {
  const publicDir = path.join(process.cwd(), 'public');

  // Pour le moment, on sauvegarde juste le SVG
  // En production, on utiliserait sharp ou puppeteer pour convertir en PNG
  fs.writeFileSync(path.join(publicDir, `${filename}.svg`), svg);

  console.log(`Generated ${filename}.svg (${size}x${size})`);

  // Créer un fichier PNG factice pour la demo
  // En réalité, il faudrait un outil de conversion SVG->PNG
  const pngPlaceholder = `<!-- PNG placeholder for ${filename} (${size}x${size}) -->`;
  fs.writeFileSync(path.join(publicDir, `${filename}.png`), pngPlaceholder);

  console.log(`Generated ${filename}.png placeholder`);
};

// Générer les icônes
console.log('Generating PWA icons...');

// Icône 192x192
const icon192 = generateIcon(192);
saveSVGAsIcon(icon192, 'icon-192', 192);

// Icône 512x512
const icon512 = generateIcon(512);
saveSVGAsIcon(icon512, 'icon-512', 512);

// Favicon
const favicon = generateIcon(48);
saveSVGAsIcon(favicon, 'favicon', 48);

console.log('✅ All icons generated successfully!');
console.log('📁 Check /public/ folder for the generated files');
console.log('💡 Note: In production, use a tool like sharp to convert SVG to PNG');
