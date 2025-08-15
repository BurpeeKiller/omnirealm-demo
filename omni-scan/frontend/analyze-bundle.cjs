#!/usr/bin/env node

/**
 * Script d'analyse des bundles pour mesurer l'impact des optimisations
 * Compare les tailles avant/après optimisation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Analyse des optimisations de bundle...\n');

// Fonction pour obtenir la taille d'un fichier
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

// Fonction pour formater la taille
function formatSize(bytes) {
  const kb = bytes / 1024;
  return `${kb.toFixed(2)} KB`;
}

// Analyser le build actuel
function analyzeBuild() {
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.log('❌ Dossier dist non trouvé. Lancez `pnpm build` d\'abord.');
    return;
  }

  const jsFiles = fs.readdirSync(path.join(distPath, 'assets'))
    .filter(f => f.endsWith('.js'))
    .map(f => {
      const filePath = path.join(distPath, 'assets', f);
      const size = getFileSize(filePath);
      return { name: f, size };
    })
    .sort((a, b) => b.size - a.size);

  // Calculer les totaux
  const totalSize = jsFiles.reduce((sum, f) => sum + f.size, 0);
  const mainBundle = jsFiles.find(f => f.name.includes('index-'));
  const vendorBundles = jsFiles.filter(f => f.name.includes('vendor'));
  
  console.log('📊 Analyse du bundle actuel:\n');
  console.log(`Bundle principal: ${mainBundle ? formatSize(mainBundle.size) : 'Non trouvé'}`);
  console.log(`Bundles vendor: ${vendorBundles.length} fichiers, ${formatSize(vendorBundles.reduce((sum, f) => sum + f.size, 0))}`);
  console.log(`\nTaille totale JS: ${formatSize(totalSize)}`);
  
  // Top 5 des plus gros fichiers
  console.log('\n🏆 Top 5 des plus gros fichiers:');
  jsFiles.slice(0, 5).forEach((f, i) => {
    console.log(`${i + 1}. ${f.name}: ${formatSize(f.size)}`);
  });

  // Analyse des optimisations appliquées
  console.log('\n✅ Optimisations détectées:');
  
  // Vérifier le code splitting
  const chunks = jsFiles.filter(f => !f.name.includes('index') && !f.name.includes('vendor'));
  console.log(`- Code splitting: ${chunks.length} chunks séparés`);
  
  // Vérifier le lazy loading
  const lazyChunks = chunks.filter(f => f.size < 10 * 1024); // < 10KB
  console.log(`- Lazy loading: ${lazyChunks.length} petits chunks (< 10KB)`);
  
  // Vérifier la compression
  const gzipSize = execSync(`du -sh dist/assets/*.gz 2>/dev/null | awk '{sum += $1} END {print sum}'`, { encoding: 'utf8' }).trim() || '0';
  console.log(`- Compression gzip: ${gzipSize === '0' ? 'Non activée' : 'Activée'}`);
  
  // Recommandations
  console.log('\n💡 Recommandations:');
  
  if (mainBundle && mainBundle.size > 100 * 1024) {
    console.log('⚠️  Le bundle principal est > 100KB. Considérez plus de code splitting.');
  }
  
  if (chunks.length < 5) {
    console.log('⚠️  Peu de chunks détectés. Augmentez le lazy loading des routes.');
  }
  
  if (vendorBundles.length === 0) {
    console.log('⚠️  Pas de séparation vendor/app. Activez manualChunks dans Vite.');
  }
  
  console.log('\n✨ Score d\'optimisation: ' + calculateScore(totalSize, chunks.length, mainBundle));
}

function calculateScore(totalSize, chunksCount, mainBundle) {
  let score = 100;
  
  // Pénalité pour taille totale
  if (totalSize > 1000 * 1024) score -= 20; // > 1MB
  else if (totalSize > 500 * 1024) score -= 10; // > 500KB
  
  // Pénalité pour bundle principal trop gros
  if (mainBundle && mainBundle.size > 200 * 1024) score -= 20; // > 200KB
  else if (mainBundle && mainBundle.size > 100 * 1024) score -= 10; // > 100KB
  
  // Bonus pour code splitting
  score += Math.min(chunksCount * 2, 20); // Max +20 points
  
  return `${Math.max(0, score)}/100`;
}

// Lancer l'analyse
analyzeBuild();