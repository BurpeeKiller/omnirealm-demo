# OmniFit Backend API

Backend minimal FastAPI pour gérer les paiements Stripe d'OmniFit.

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. Configurer les variables
cp .env.example .env
# Éditer .env avec vos clés Stripe

# 3. Lancer le serveur
python main.py
# API disponible sur http://localhost:8003
```

## 🔑 Configuration Stripe

1. Créer un compte sur [Stripe Dashboard](https://dashboard.stripe.com)
2. Récupérer les clés API de test
3. Créer 2 produits :
   - Monthly : 29€/mois
   - Yearly : 290€/an (2 mois offerts)
4. Configurer le webhook endpoint : `http://localhost:8003/api/webhook/stripe`

## 📡 Endpoints

- `POST /api/create-checkout-session` - Crée une session de paiement
- `POST /api/create-portal-session` - Accès au portail client
- `POST /api/webhook/stripe` - Webhook pour les événements Stripe
- `GET /api/subscription/{customer_id}` - Statut d'abonnement

## 🧪 Test local

```bash
# Tester le checkout
curl -X POST http://localhost:8003/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"price_id": "price_xxx", "user_email": "test@example.com"}'

# Tester les webhooks avec Stripe CLI
stripe listen --forward-to localhost:8003/api/webhook/stripe
```