#!/usr/bin/env node

/**
 * Script de test automatisé pour OmniFit
 * Identifie les bugs potentiels dans l'application
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const APP_URL = 'http://localhost:3003';
const TIMEOUT = 30000;

// Couleurs pour console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[✓]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[✗]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[!]${colors.reset} ${msg}`),
  test: (msg) => console.log(`${colors.magenta}[TEST]${colors.reset} ${msg}`)
};

class AppTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.bugs = [];
    this.consoleErrors = [];
  }

  async init() {
    log.info('Lancement du navigateur...');
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 390,
        height: 844
      },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Capturer les erreurs console
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon') && !text.includes('icon-192')) {
          this.consoleErrors.push(text);
          log.error(`Console: ${text}`);
        }
      }
    });

    // Capturer les erreurs de page
    this.page.on('error', err => {
      this.bugs.push({
        type: 'Page Error',
        message: err.message,
        severity: 'high'
      });
      log.error(`Page Error: ${err.message}`);
    });

    // Capturer les requêtes échouées
    this.page.on('requestfailed', request => {
      if (!request.url().includes('favicon') && !request.url().includes('icon-192')) {
        this.bugs.push({
          type: 'Network Error',
          url: request.url(),
          message: request.failure().errorText,
          severity: 'medium'
        });
        log.error(`Network: ${request.url()} - ${request.failure().errorText}`);
      }
    });
  }

  async testNavigation() {
    log.test('Test de navigation et scroll...');
    
    try {
      await this.page.goto(APP_URL, { waitUntil: 'networkidle2' });
      
      // Test scroll pour vérifier hide/show des navs
      const headerVisible = await this.page.$eval('header', el => {
        const styles = window.getComputedStyle(el);
        return styles.transform === 'none' || styles.transform === 'translateY(0px)';
      });
      
      // Scroll down
      await this.page.evaluate(() => window.scrollTo(0, 500));
      await this.page.waitForTimeout(500);
      
      const headerHidden = await this.page.$eval('header', el => {
        const styles = window.getComputedStyle(el);
        return styles.transform.includes('translateY(-');
      });
      
      if (!headerHidden) {
        this.bugs.push({
          type: 'UI Bug',
          message: 'Header ne se cache pas au scroll down',
          severity: 'low'
        });
      }
      
      // Scroll up
      await this.page.evaluate(() => window.scrollTo(0, 0));
      await this.page.waitForTimeout(500);
      
      log.success('Test de navigation complété');
    } catch (error) {
      this.bugs.push({
        type: 'Navigation Error',
        message: error.message,
        severity: 'high'
      });
    }
  }

  async testModals() {
    log.test('Test des modales...');
    
    const modals = [
      { name: 'Settings', selector: 'button[aria-label*="Réglages"]' },
      { name: 'Stats', selector: 'button[aria-label*="Stats"]' },
      { name: 'Security', selector: 'button[aria-label*="Sécurité"]' },
      { name: 'Premium', selector: 'button[aria-label*="Premium"]' },
      { name: 'Programmes', selector: 'button[aria-label*="programmes"]' }
    ];

    for (const modal of modals) {
      try {
        log.info(`Test modal: ${modal.name}`);
        
        // Attendre que le bouton soit visible
        await this.page.waitForSelector(modal.selector, { timeout: 5000 });
        
        // Cliquer sur le bouton
        await this.page.click(modal.selector);
        await this.page.waitForTimeout(500);
        
        // Vérifier si une modal est apparue
        const modalVisible = await this.page.evaluate(() => {
          const dialogs = document.querySelectorAll('[role="dialog"]');
          return dialogs.length > 0 && Array.from(dialogs).some(d => 
            window.getComputedStyle(d).display !== 'none'
          );
        });
        
        if (!modalVisible) {
          this.bugs.push({
            type: 'Modal Bug',
            message: `Modal ${modal.name} ne s'ouvre pas`,
            severity: 'medium'
          });
        } else {
          // Fermer la modal
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(300);
        }
        
      } catch (error) {
        this.bugs.push({
          type: 'Modal Error',
          message: `Erreur modal ${modal.name}: ${error.message}`,
          severity: 'medium'
        });
      }
    }
    
    log.success('Test des modales complété');
  }

  async testAuthentication() {
    log.test('Test authentification...');
    
    try {
      // Cliquer sur connexion
      const loginBtn = await this.page.$('button:has-text("Connexion")');
      if (loginBtn) {
        await loginBtn.click();
        await this.page.waitForTimeout(1000);
        
        // Vérifier si la modal de login est visible
        const loginModal = await this.page.$('[role="dialog"]');
        if (!loginModal) {
          this.bugs.push({
            type: 'Auth Bug',
            message: 'Modal de connexion ne s\'affiche pas',
            severity: 'high'
          });
        } else {
          // Tester avec des credentials invalides
          await this.page.type('input[type="email"]', 'test@example.com');
          await this.page.type('input[type="password"]', 'password123');
          
          const submitBtn = await this.page.$('button[type="submit"]');
          if (submitBtn) {
            await submitBtn.click();
            await this.page.waitForTimeout(2000);
            
            // Vérifier si une erreur est affichée
            const errorMsg = await this.page.$('.text-red-400');
            if (!errorMsg) {
              this.bugs.push({
                type: 'Auth Bug',
                message: 'Pas de message d\'erreur pour credentials invalides',
                severity: 'medium'
              });
            }
          }
        }
      }
      
      log.success('Test authentification complété');
    } catch (error) {
      this.bugs.push({
        type: 'Auth Error',
        message: error.message,
        severity: 'high'
      });
    }
  }

  async testExerciseCards() {
    log.test('Test des cartes d\'exercices...');
    
    try {
      // Recharger la page
      await this.page.reload({ waitUntil: 'networkidle2' });
      
      // Attendre les cartes
      await this.page.waitForSelector('.exercise-card, [class*="rounded-lg"][class*="p-6"]', { timeout: 5000 });
      
      // Compter les cartes
      const cardCount = await this.page.$$eval('.exercise-card, [class*="rounded-lg"][class*="p-6"]', cards => cards.length);
      
      if (cardCount === 0) {
        this.bugs.push({
          type: 'Content Bug',
          message: 'Aucune carte d\'exercice visible',
          severity: 'high'
        });
      }
      
      // Tester le clic sur une carte
      const firstCard = await this.page.$('.exercise-card, [class*="rounded-lg"][class*="p-6"]');
      if (firstCard) {
        await firstCard.click();
        await this.page.waitForTimeout(500);
        
        // Vérifier si quelque chose s'est passé
        const modalOpened = await this.page.$('[role="dialog"]');
        const counterChanged = await this.page.evaluate(() => {
          const counters = document.querySelectorAll('[class*="text-4xl"], [class*="text-5xl"]');
          return Array.from(counters).some(c => c.textContent !== '0');
        });
        
        if (!modalOpened && !counterChanged) {
          this.bugs.push({
            type: 'Interaction Bug',
            message: 'Les cartes d\'exercice ne réagissent pas au clic',
            severity: 'medium'
          });
        }
      }
      
      log.success('Test des cartes complété');
    } catch (error) {
      this.bugs.push({
        type: 'Exercise Error',
        message: error.message,
        severity: 'medium'
      });
    }
  }

  async testResponsive() {
    log.test('Test responsive...');
    
    const viewports = [
      { name: 'Mobile', width: 390, height: 844 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1440, height: 900 }
    ];

    for (const viewport of viewports) {
      try {
        log.info(`Test viewport: ${viewport.name}`);
        await this.page.setViewport(viewport);
        await this.page.waitForTimeout(500);
        
        // Vérifier si le layout est cassé
        const layoutIssues = await this.page.evaluate(() => {
          const issues = [];
          
          // Vérifier les éléments qui débordent
          const elements = document.querySelectorAll('*');
          elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
              issues.push(`Élément déborde: ${el.className}`);
            }
          });
          
          return issues;
        });
        
        if (layoutIssues.length > 0) {
          this.bugs.push({
            type: 'Responsive Bug',
            message: `Issues sur ${viewport.name}: ${layoutIssues.join(', ')}`,
            severity: 'low'
          });
        }
        
      } catch (error) {
        this.bugs.push({
          type: 'Responsive Error',
          message: `${viewport.name}: ${error.message}`,
          severity: 'low'
        });
      }
    }
    
    log.success('Test responsive complété');
  }

  async generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log(colors.magenta + 'RAPPORT DE TEST OMNFIT' + colors.reset);
    console.log('='.repeat(60) + '\n');
    
    if (this.bugs.length === 0) {
      log.success('Aucun bug détecté ! 🎉');
    } else {
      log.warning(`${this.bugs.length} bugs détectés:`);
      
      // Grouper par sévérité
      const highSeverity = this.bugs.filter(b => b.severity === 'high');
      const mediumSeverity = this.bugs.filter(b => b.severity === 'medium');
      const lowSeverity = this.bugs.filter(b => b.severity === 'low');
      
      if (highSeverity.length > 0) {
        console.log(`\n${colors.red}HAUTE PRIORITÉ:${colors.reset}`);
        highSeverity.forEach(bug => {
          console.log(`  • [${bug.type}] ${bug.message}`);
        });
      }
      
      if (mediumSeverity.length > 0) {
        console.log(`\n${colors.yellow}PRIORITÉ MOYENNE:${colors.reset}`);
        mediumSeverity.forEach(bug => {
          console.log(`  • [${bug.type}] ${bug.message}`);
        });
      }
      
      if (lowSeverity.length > 0) {
        console.log(`\n${colors.blue}BASSE PRIORITÉ:${colors.reset}`);
        lowSeverity.forEach(bug => {
          console.log(`  • [${bug.type}] ${bug.message}`);
        });
      }
    }
    
    if (this.consoleErrors.length > 0) {
      console.log(`\n${colors.yellow}Erreurs console (${this.consoleErrors.length}):${colors.reset}`);
      this.consoleErrors.slice(0, 5).forEach(err => {
        console.log(`  • ${err.substring(0, 100)}...`);
      });
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.init();
      
      // Exécuter tous les tests
      await this.testNavigation();
      await this.testModals();
      await this.testAuthentication();
      await this.testExerciseCards();
      await this.testResponsive();
      
      // Générer le rapport
      await this.generateReport();
      
    } catch (error) {
      log.error(`Erreur fatale: ${error.message}`);
    } finally {
      await this.close();
    }
  }
}

// Lancer les tests
const tester = new AppTester();
tester.run().catch(console.error);