#!/usr/bin/env node

/**
 * Test CI/CD pour OmniFit PWA
 * Usage: node fitness-ci-test.js
 */

import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { logger } from '../src/utils/logger';

const CONFIG = {
  baseUrl: 'https://frolicking-stardust-cd010f.netlify.app',
  timeout: 10000,
  expectedTitle: 'OmniFit',
  requiredResources: [
    '/icon-192.png',
    '/icon-512.png', 
    '/sw.js'
  ],
  securityHeaders: [
    'content-security-policy',
    'x-frame-options', 
    'x-content-type-options',
    'referrer-policy'
  ]
};

class FitnessTestSuite {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      url: CONFIG.baseUrl,
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  log(level, message) {
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    logger.info(`${icons[level] || '•'} ${message}`);
  }

  addResult(testName, status, message, details = null) {
    this.results.tests.push({
      name: testName,
      status,
      message,
      details,
      timestamp: new Date().toISOString()
    });

    if (status === 'passed') this.results.passed++;
    else if (status === 'failed') this.results.failed++;
    else if (status === 'warning') this.results.warnings++;
  }

  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async testBasicAccessibility() {
    this.log('info', 'Test d\'accessibilité de base...');
    
    try {
      const startTime = Date.now();
      const response = await this.fetchWithTimeout(CONFIG.baseUrl);
      const loadTime = Date.now() - startTime;

      if (response.ok) {
        this.addResult(
          'Accessibilité',
          'passed',
          `Application accessible (${response.status}) en ${loadTime}ms`,
          { status: response.status, loadTime }
        );
        this.log('success', `Accessible en ${loadTime}ms`);
      } else {
        this.addResult('Accessibilité', 'failed', `HTTP ${response.status}`);
        this.log('error', `Non accessible (HTTP ${response.status})`);
      }
    } catch (error) {
      this.addResult('Accessibilité', 'failed', error.message);
      this.log('error', `Erreur de connexion: ${error.message}`);
    }
  }

  async testHTMLContent() {
    this.log('info', 'Test du contenu HTML...');

    try {
      const response = await this.fetchWithTimeout(CONFIG.baseUrl);
      const html = await response.text();

      // Vérifier DOCTYPE HTML5
      if (html.includes('<!doctype html>') || html.includes('<!DOCTYPE html>')) {
        this.addResult('HTML5 DOCTYPE', 'passed', 'DOCTYPE HTML5 présent');
        this.log('success', 'DOCTYPE HTML5 valide');
      } else {
        this.addResult('HTML5 DOCTYPE', 'failed', 'DOCTYPE HTML5 manquant');
        this.log('error', 'DOCTYPE HTML5 manquant');
      }

      // Vérifier le titre
      const titleMatch = html.match(/<title>([^<]*)<\/title>/);
      if (titleMatch && titleMatch[1].includes('Fitness')) {
        this.addResult('Titre', 'passed', `Titre trouvé: ${titleMatch[1]}`);
        this.log('success', `Titre: ${titleMatch[1]}`);
      } else {
        this.addResult('Titre', 'failed', 'Titre manquant ou incorrect');
        this.log('error', 'Titre manquant');
      }

      // Vérifier viewport responsive
      if (html.includes('viewport')) {
        this.addResult('Responsive', 'passed', 'Meta viewport présent');
        this.log('success', 'Meta viewport configuré');
      } else {
        this.addResult('Responsive', 'warning', 'Meta viewport manquant');
        this.log('warning', 'Meta viewport manquant');
      }

    } catch (error) {
      this.addResult('HTML Content', 'failed', error.message);
      this.log('error', `Erreur analyse HTML: ${error.message}`);
    }
  }

  async testPWAManifest() {
    this.log('info', 'Test du manifest PWA...');

    try {
      // D'abord récupérer le HTML pour trouver le manifest
      const pageResponse = await this.fetchWithTimeout(CONFIG.baseUrl);
      const html = await pageResponse.text();
      
      // Chercher le lien vers le manifest
      const manifestMatch = html.match(/href="([^"]*manifest[^"]*\.json)"/);
      
      if (!manifestMatch) {
        this.addResult('PWA Manifest', 'failed', 'Lien manifest non trouvé dans HTML');
        this.log('error', 'Lien manifest non trouvé');
        return;
      }

      const manifestUrl = manifestMatch[1].startsWith('/') 
        ? `${CONFIG.baseUrl}${manifestMatch[1]}`
        : manifestMatch[1];

      const manifestResponse = await this.fetchWithTimeout(manifestUrl);
      
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        
        // Vérifications du manifest
        const requiredFields = ['name', 'start_url', 'display', 'icons'];
        const missingFields = requiredFields.filter(field => !manifest[field]);
        
        if (missingFields.length === 0) {
          this.addResult(
            'PWA Manifest',
            'passed',
            `Manifest complet: ${manifest.name}`,
            { manifest: manifest }
          );
          this.log('success', `Manifest PWA: ${manifest.name}`);
        } else {
          this.addResult(
            'PWA Manifest', 
            'warning',
            `Champs manquants: ${missingFields.join(', ')}`
          );
          this.log('warning', `Champs manquants: ${missingFields.join(', ')}`);
        }
      } else {
        this.addResult('PWA Manifest', 'failed', `Manifest inaccessible (${manifestResponse.status})`);
        this.log('error', `Manifest inaccessible (${manifestResponse.status})`);
      }
    } catch (error) {
      this.addResult('PWA Manifest', 'failed', error.message);
      this.log('error', `Erreur manifest: ${error.message}`);
    }
  }

  async testServiceWorker() {
    this.log('info', 'Test du Service Worker...');

    try {
      const swResponse = await this.fetchWithTimeout(`${CONFIG.baseUrl}/sw.js`);
      
      if (swResponse.ok) {
        this.addResult('Service Worker', 'passed', 'Service Worker accessible');
        this.log('success', 'Service Worker disponible');
      } else {
        this.addResult('Service Worker', 'warning', `SW non trouvé (${swResponse.status})`);
        this.log('warning', 'Service Worker non trouvé');
      }
    } catch (error) {
      this.addResult('Service Worker', 'warning', error.message);
      this.log('warning', `Service Worker: ${error.message}`);
    }
  }

  async testRequiredResources() {
    this.log('info', 'Test des ressources essentielles...');

    for (const resource of CONFIG.requiredResources) {
      try {
        const response = await this.fetchWithTimeout(`${CONFIG.baseUrl}${resource}`);
        
        if (response.ok) {
          this.addResult(`Ressource ${resource}`, 'passed', 'Ressource disponible');
          this.log('success', `${resource} disponible`);
        } else {
          this.addResult(`Ressource ${resource}`, 'warning', `Non trouvée (${response.status})`);
          this.log('warning', `${resource} non trouvé`);
        }
      } catch (error) {
        this.addResult(`Ressource ${resource}`, 'warning', error.message);
        this.log('warning', `${resource}: ${error.message}`);
      }
    }
  }

  async testSecurityHeaders() {
    this.log('info', 'Test des headers de sécurité...');

    try {
      const response = await this.fetchWithTimeout(CONFIG.baseUrl, { method: 'HEAD' });
      const headers = response.headers;

      for (const header of CONFIG.securityHeaders) {
        if (headers.has(header)) {
          this.addResult(`Header ${header}`, 'passed', 'Header présent');
          this.log('success', `${header} configuré`);
        } else {
          this.addResult(`Header ${header}`, 'warning', 'Header manquant');
          this.log('warning', `${header} manquant`);
        }
      }
    } catch (error) {
      this.addResult('Security Headers', 'failed', error.message);
      this.log('error', `Erreur headers: ${error.message}`);
    }
  }

  async runAllTests() {
    logger.info('🚀 DÉMARRAGE DES TESTS FITNESS REMINDER PWA');
    logger.info('=' .repeat(50));
    logger.info(`📅 ${new Date().toLocaleString('fr-FR')}`);
    logger.info(`🌐 ${CONFIG.baseUrl}`);
    logger.info('=' .repeat(50));

    await this.testBasicAccessibility();
    await this.testHTMLContent();
    await this.testPWAManifest();
    await this.testServiceWorker();
    await this.testRequiredResources();
    await this.testSecurityHeaders();

    this.generateReport();
  }

  generateReport() {
    logger.info('\n' + '=' .repeat(50));
    logger.info('📋 RAPPORT DE TEST');
    logger.info('=' .repeat(50));

    const total = this.results.passed + this.results.failed + this.results.warnings;
    const successRate = Math.round((this.results.passed / total) * 100);

    logger.info(`📊 Résultats: ${this.results.passed}✅ ${this.results.failed}❌ ${this.results.warnings}⚠️`);
    logger.info(`📈 Taux de réussite: ${successRate}%`);

    if (this.results.failed > 0) {
      logger.info('\n❌ ÉCHECS:');
      this.results.tests
        .filter(t => t.status === 'failed')
        .forEach(t => logger.info(`  • ${t.name}: ${t.message}`));
    }

    if (this.results.warnings > 0) {
      logger.info('\n⚠️ AVERTISSEMENTS:');
      this.results.tests
        .filter(t => t.status === 'warning')
        .forEach(t => logger.info(`  • ${t.name}: ${t.message}`));
    }

    logger.info('\n✅ SUCCÈS:');
    this.results.tests
      .filter(t => t.status === 'passed')
      .forEach(t => logger.info(`  • ${t.name}: ${t.message}`));

    // Recommandations
    logger.info('\n💡 RECOMMANDATIONS:');
    if (this.results.failed > 0) {
      logger.info('  🔥 CRITIQUE: Corriger les échecs immédiatement');
    }
    if (this.results.warnings > 3) {
      logger.info('  ⚡ IMPORTANT: Traiter les avertissements de sécurité');
    }
    logger.info('  📱 SUGGÉRÉ: Ajouter tests E2E avec Playwright');

    logger.info('=' .repeat(50));

    // Retourner les résultats au lieu de faire process.exit
    return {
      success: this.results.failed === 0,
      results: this.results
    };
  }

  async saveResults(filename = 'fitness-test-results.json') {
    try {
      await fs.writeFile(filename, JSON.stringify(this.results, null, 2));
      this.log('info', `Résultats sauvegardés: ${filename}`);
    } catch (error) {
      this.log('error', `Erreur sauvegarde: ${error.message}`);
    }
  }
}

// Exécution
const testSuite = new FitnessTestSuite();
testSuite.runAllTests()
  .then(() => testSuite.saveResults())
  .then(() => {
    logger.info('\n📁 Résultats sauvegardés dans fitness-test-results.json');
  })
  .catch(console.error);