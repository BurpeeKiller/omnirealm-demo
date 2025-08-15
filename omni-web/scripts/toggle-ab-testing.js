#!/usr/bin/env node

/**
 * Script pour activer/désactiver les tests A/B sur la page OmniScan
 * Usage: node scripts/toggle-ab-testing.js [enable|disable]
 */

const fs = require('fs');
const path = require('path');

const OMNISCAN_PAGE = path.join(__dirname, '../src/app/produits/omniscan/page.tsx');
const OMNISCAN_AB_PAGE = path.join(__dirname, '../src/app/produits/omniscan/page-ab-test.tsx');
const BACKUP_PAGE = path.join(__dirname, '../src/app/produits/omniscan/page.original.tsx');

function backupOriginal() {
  if (!fs.existsSync(BACKUP_PAGE)) {
    console.log('📁 Creating backup of original page...');
    fs.copyFileSync(OMNISCAN_PAGE, BACKUP_PAGE);
  }
}

function enableABTesting() {
  console.log('🚀 Enabling A/B testing on OmniScan page...');
  
  backupOriginal();
  
  // Copy A/B test version to main page
  fs.copyFileSync(OMNISCAN_AB_PAGE, OMNISCAN_PAGE);
  
  console.log('✅ A/B testing enabled!');
  console.log('📊 Access dashboard at: /admin/ab-tests');
  console.log('🧪 Tests active:');
  console.log('  - Hero messaging (OCR Intelligent vs Extraction Automatique)');
  console.log('  - CTA style (Blue vs Green vs Orange)');
  console.log('  - Pricing display (Standard vs Discount)');
  console.log('  - Social proof (None vs Stats vs Testimonials)');
}

function disableABTesting() {
  console.log('🔄 Disabling A/B testing on OmniScan page...');
  
  if (!fs.existsSync(BACKUP_PAGE)) {
    console.error('❌ No backup found. Cannot restore original page.');
    console.log('💡 Manual restoration required.');
    return;
  }
  
  // Restore original page
  fs.copyFileSync(BACKUP_PAGE, OMNISCAN_PAGE);
  
  console.log('✅ A/B testing disabled!');
  console.log('📄 Original page restored.');
}

function showStatus() {
  console.log('📊 A/B Testing Status');
  console.log('=====================');
  
  const pageContent = fs.readFileSync(OMNISCAN_PAGE, 'utf8');
  const hasABTesting = pageContent.includes('ABTestProvider');
  
  console.log(`Status: ${hasABTesting ? '🟢 ENABLED' : '🔴 DISABLED'}`);
  
  if (hasABTesting) {
    console.log('Active features:');
    console.log('  - ABTestProvider context');
    console.log('  - ABOptimizedHero component');  
    console.log('  - ABOptimizedPricing component');
    console.log('  - ABOptimizedSocialProof component');
    console.log('');
    console.log('Dashboard: /admin/ab-tests');
  } else {
    console.log('Standard page without A/B testing');
  }
  
  console.log('');
  console.log('Files:');
  console.log(`  - Main: ${OMNISCAN_PAGE}`);
  console.log(`  - A/B Version: ${OMNISCAN_AB_PAGE}`);
  console.log(`  - Backup: ${fs.existsSync(BACKUP_PAGE) ? '✅' : '❌'} ${BACKUP_PAGE}`);
}

function showHelp() {
  console.log('🧪 A/B Testing Toggle Script');
  console.log('============================');
  console.log('');
  console.log('Usage: node scripts/toggle-ab-testing.js [command]');
  console.log('');
  console.log('Commands:');
  console.log('  enable    Enable A/B testing on OmniScan page');
  console.log('  disable   Disable A/B testing and restore original page');
  console.log('  status    Show current A/B testing status');
  console.log('  help      Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/toggle-ab-testing.js enable');
  console.log('  node scripts/toggle-ab-testing.js status');
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'enable':
    enableABTesting();
    break;
  case 'disable':
    disableABTesting();
    break;
  case 'status':
    showStatus();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    console.log('❌ Invalid command. Use "help" for usage information.');
    process.exit(1);
}