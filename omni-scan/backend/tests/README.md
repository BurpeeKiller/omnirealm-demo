# OmniScan Revenue Protection Test Suite

🛡️ **Suite de tests critique pour protéger les revenus OCR d'OmniScan**

## 📋 Vue d'ensemble

Cette suite de tests complète protège les revenus d'OmniScan en s'assurant que :
- ✅ Seuls les utilisateurs payants peuvent dépasser les quotas gratuits
- 🔒 L'authentification et l'autorisation sont inviolables  
- 💳 Les paiements Stripe sont sécurisés et fiables
- 🚫 Les attaques par injection et uploads malveillants sont bloquées
- ⚡ Le service reste performant sous charge
- 🔧 La résilience face aux pannes de services externes

## 🗂️ Structure des tests

### 📁 `business/` - Tests critiques de logique métier
- **`test_quota_protection.py`** - Protection des quotas utilisateurs
- **`test_auth_security.py`** - Sécurité d'authentification 
- **`test_stripe_integration.py`** - Intégration Stripe sécurisée
- **`test_file_validation.py`** - Validation des fichiers uploadés
- **`test_rate_limiting.py`** - Limitation du taux de requêtes
- **`test_ocr_error_handling.py`** - Gestion d'erreurs OCR

### 🔒 `security/` - Tests de sécurité
- **`test_injection_attacks.py`** - Protection contre injections SQL/commandes/XSS

### ⚡ `performance/` - Tests de performance
- **`test_load_testing.py`** - Tests de charge et détection memory leaks

### 🧪 `mocks/` - Services externes mockés  
- **`test_external_services.py`** - Mocks OpenAI, Stripe, Redis

## 🚀 Exécution des tests

### Tests complets (recommandé pour CI/CD)
```bash
# Tous les tests de protection des revenus
pytest tests/business/ tests/security/ -v --cov=app --cov-report=html

# Tests critiques seulement (rapide)
pytest tests/business/test_quota_protection.py tests/business/test_stripe_integration.py -v
```

### Tests par catégorie
```bash
# Protection des quotas (CRITIQUE)
pytest tests/business/test_quota_protection.py -v

# Sécurité authentification (CRITIQUE) 
pytest tests/business/test_auth_security.py -v

# Intégration Stripe (CRITIQUE)
pytest tests/business/test_stripe_integration.py -v  

# Tests de sécurité (CRITIQUE)
pytest tests/security/ -v

# Tests de performance 
pytest tests/performance/ -v

# Services externes mockés
pytest tests/mocks/ -v
```

### Tests avec options avancées
```bash
# Tests parallèles (plus rapide)
pytest tests/business/ -n auto

# Tests avec timeout (éviter les blocages)
pytest tests/performance/ --timeout=300

# Tests avec coverage détaillé  
pytest tests/ --cov=app --cov-report=term-missing --cov-fail-under=80

# Tests de régression sur les quotas
pytest tests/business/test_quota_protection.py::TestQuotaProtection::test_free_user_over_quota_blocked -v
```

## 🎯 Tests critiques à surveiller

### 🔴 **ROUGE - Critique pour les revenus**
Si ces tests échouent, les revenus sont en danger immédiat :

1. **`test_free_user_over_quota_blocked`** - Utilisateurs gratuits bloqués après quota
2. **`test_pro_user_unlimited_access`** - Utilisateurs Pro ont accès illimité  
3. **`test_stripe_checkout_creation_security`** - Sécurité création paiement
4. **`test_webhook_signature_validation`** - Validation webhooks Stripe
5. **`test_sql_injection_protection`** - Protection injections SQL
6. **`test_token_manipulation_protection`** - Protection manipulation JWT

### 🟡 **ORANGE - Important pour la stabilité**
2. **`test_concurrent_upload_stress`** - Stabilité sous charge
3. **`test_memory_usage_under_load`** - Pas de memory leaks  
4. **`test_file_size_limits`** - Limites tailles fichiers
5. **`test_ocr_error_recovery`** - Récupération erreurs OCR

### 🟢 **VERT - Qualité et résilience**  
6. **`test_external_service_mocks`** - Résilience pannes externes
7. **`test_rate_limiting_simulation`** - Limitation accès abusifs

## 📊 Métriques de succès

### 💯 Objectifs de couverture
- **Business logic**: 95%+ (critique revenus)
- **Security modules**: 90%+ (protection attaques)  
- **API endpoints**: 85%+ (stabilité service)
- **Overall**: 80%+ minimum

### ⏱️ Performance attendue
- **Tests de quotas**: < 5s
- **Tests Stripe**: < 10s  
- **Tests sécurité**: < 15s
- **Tests de charge**: < 60s
- **Suite complète**: < 5min

## 🔧 Configuration

### Variables d'environnement requises
```bash
# Test environment  
ENVIRONMENT=testing
SECRET_KEY=test-secret-key-change-in-production
JWT_SECRET_KEY=test-jwt-secret-key

# Services externes (mocks en test)
STRIPE_SECRET_KEY=sk_test_mock_key
REDIS_URL=redis://localhost:6379
SUPABASE_URL=http://mock-supabase.test
SUPABASE_ANON_KEY=mock-anon-key
```

### Dépendances supplémentaires pour tests
```bash
pip install pytest pytest-cov pytest-asyncio pytest-mock
pip install pytest-xdist pytest-timeout  # Performance  
pip install safety bandit semgrep        # Sécurité
pip install psutil pillow               # Monitoring
```

## 🚨 Alertes et monitoring

### Échecs critiques → Alerte immédiate
- Tests de protection quotas échouent
- Vulnérabilités de sécurité détectées  
- Memory leaks détectés en performance
- Stripe webhooks non sécurisés

### Configuration Slack pour alertes
```yaml
SLACK_SECURITY_WEBHOOK: "https://hooks.slack.com/..."
SLACK_DEV_WEBHOOK: "https://hooks.slack.com/..." 
```

## 📈 CI/CD Pipeline

### Déclencheurs automatiques
- **Push sur main/develop** → Tests complets
- **Pull Request** → Tests critiques  
- **Quotidien 2h** → Audit sécurité complet
- **Tag `[security-scan]`** → Tests de pénétration

### Étapes pipeline
1. **Security Audit** - Scan vulnérabilités (Safety, Bandit, Semgrep)
2. **Revenue Critical Tests** - Tests protection revenus
3. **Integration Tests** - Tests end-to-end  
4. **Penetration Testing** - Tests sécurité avancés (hebdo)
5. **Compliance Check** - Vérification conformité
6. **Notification** - Alertes si échec critique

## 🛠️ Debugging et dépannage

### Tests qui échouent fréquemment
```bash  
# Vérifier état Redis local
redis-cli ping

# Vérifier Tesseract installé
tesseract --version

# Nettoyer cache pytest
pytest --cache-clear

# Tests verbeux avec stack trace
pytest tests/business/test_quota_protection.py -vvs --tb=long
```

### Diagnostics courants
```bash
# Vérifier permissions fichiers temporaires
ls -la /tmp/pytest-*

# Monitor usage mémoire pendant tests
pytest tests/performance/ --tb=short & top -p $!

# Logs détaillés erreurs OCR
pytest tests/business/test_ocr_error_handling.py -s --log-cli-level=DEBUG
```

## 📚 Ressources et références

- **Stripe Testing**: https://stripe.com/docs/testing
- **JWT Security**: https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/  
- **Python Security**: https://bandit.readthedocs.io/
- **OCR Testing**: https://tesseract-ocr.github.io/

## 🤝 Contribution aux tests

### Ajout de nouveaux tests de protection
1. Identifier le risque métier
2. Créer test dans la catégorie appropriée
3. Marquer comme critique si impact revenus
4. Ajouter à la pipeline CI/CD
5. Documenter dans ce README

### Priorités pour nouveaux tests
1. **Bugs de sécurité rapportés** → Test de non-régression
2. **Nouvelles fonctionnalités payantes** → Protection quotas  
3. **Intégrations tierces** → Tests de résilience
4. **APIs publiques** → Tests de sécurité

---

**⚠️ IMPORTANT**: Ces tests protègent directement les revenus d'OmniScan. Tout échec doit être traité comme une urgence business critique.