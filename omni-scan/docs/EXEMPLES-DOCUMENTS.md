# Exemples de documents pour tester OmniScan

## 1. Facture
```
FACTURE N°2024-INV-0847
Date : 15 janvier 2024

TechnoSolutions SARL
123 Avenue de l'Innovation
75008 Paris
SIRET: 123 456 789 00012

Client:
Entreprise ABC
456 Rue du Commerce
69002 Lyon

Désignation                    Quantité    Prix Unit.    Total HT
Développement application web      80h        125€       10 000€
Formation équipe                   16h        150€        2 400€
Support technique                   1          500€          500€

                                        Total HT:      12 900€
                                        TVA 20%:        2 580€
                                        Total TTC:     15 480€

Conditions de paiement: 30 jours
Échéance: 15 février 2024
```

## 2. CV
```
Marie DUBOIS
Développeuse Full-Stack Senior
📧 marie.dubois@email.com | 📱 06 12 34 56 78
🏠 Paris, France | 💼 LinkedIn: /in/mariedubois

EXPÉRIENCE PROFESSIONNELLE

Lead Developer | TechCorp France | 2020-2024
• Management d'une équipe de 5 développeurs
• Architecture microservices avec Node.js et React
• Mise en place CI/CD avec GitLab et Docker
• Réduction du temps de déploiement de 70%

Développeuse Full-Stack | StartupXYZ | 2018-2020
• Développement d'une plateforme SaaS B2B
• Stack: React, TypeScript, Node.js, PostgreSQL
• Implémentation de tests automatisés (Jest, Cypress)

FORMATION
Master Informatique | Université Paris-Saclay | 2018
Licence Informatique | Université Paris Diderot | 2016

COMPÉTENCES
• Langages: JavaScript/TypeScript, Python, Java
• Frontend: React, Vue.js, Next.js, Tailwind CSS
• Backend: Node.js, Express, NestJS, Django
• Bases de données: PostgreSQL, MongoDB, Redis
• DevOps: Docker, Kubernetes, AWS, CI/CD
• Langues: Français (natif), Anglais (C1), Espagnol (B2)
```

## 3. Email professionnel
```
De: jean.martin@entreprise.com
À: equipe-projet@entreprise.com
Date: 20 janvier 2024 14:30
Objet: Compte-rendu réunion projet Alpha - Actions requises

Bonjour à tous,

Suite à notre réunion de ce matin concernant le projet Alpha, voici le récapitulatif des décisions prises et des actions à mener :

1. **Validation du cahier des charges** : OK, version finale validée
2. **Planning** : Début développement le 1er février, livraison phase 1 prévue le 15 mars
3. **Budget** : 150K€ alloués, à répartir selon le document joint

**Actions pour chacun :**
- Marie : Finaliser les maquettes UI/UX avant le 25/01
- Pierre : Préparer l'environnement de développement
- Sophie : Planifier les sprints et créer les tickets JIRA
- Thomas : Organiser le kick-off avec le client (semaine du 29/01)

Prochaine réunion : Vendredi 26/01 à 10h

N'hésitez pas si vous avez des questions.

Cordialement,
Jean Martin
Chef de Projet
```

## 4. Contrat de service
```
CONTRAT DE PRESTATION DE SERVICES

Entre les soussignés :

La société TechnoServices SAS, au capital de 50 000€, immatriculée au RCS de Paris sous le numéro 987 654 321, dont le siège social est situé au 789 Boulevard Digital, 75012 Paris, représentée par M. Laurent DUPONT en qualité de Directeur Général,
Ci-après dénommée "Le Prestataire",

Et :

La société ClientPro SARL, au capital de 20 000€, immatriculée au RCS de Lyon sous le numéro 456 789 123, dont le siège social est situé au 321 Avenue Business, 69003 Lyon, représentée par Mme Sophie BERNARD en qualité de Gérante,
Ci-après dénommée "Le Client",

Article 1 - Objet
Le présent contrat a pour objet la maintenance et l'évolution du système d'information du Client, comprenant :
- Maintenance corrective et évolutive des applications
- Support technique niveau 2 et 3
- Astreinte 24/7 pour les incidents critiques

Article 2 - Durée
Le présent contrat est conclu pour une durée de 12 mois à compter du 1er février 2024, renouvelable par tacite reconduction.

Article 3 - Prix et modalités de paiement
Le montant forfaitaire mensuel est fixé à 8 500€ HT, payable à 30 jours fin de mois.

Article 4 - Résiliation
Chaque partie peut résilier le contrat avec un préavis de 3 mois par lettre recommandée avec AR.

Fait à Paris, le 15 janvier 2024, en deux exemplaires originaux.
```

## Instructions pour les tests

1. **Testez différents niveaux de détail** :
   - Court : devrait donner 1-2 phrases essentielles
   - Moyen : 2-3 phrases avec infos principales
   - Détaillé : analyse complète avec tous les détails

2. **Testez différentes langues** :
   - Document en français avec résumé en anglais
   - Document mixte avec détection automatique

3. **Vérifiez l'extraction de données structurées** :
   - Facture : montants, dates, références
   - CV : nom, expérience, compétences
   - Email : expéditeur, destinataire, actions
   - Contrat : parties, durée, montant

4. **Comparez la qualité des résumés** selon le type détecté