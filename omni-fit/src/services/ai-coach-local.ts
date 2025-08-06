/**
 * Service Coach AI Local
 * Fournit des réponses prédéfinies et fonctionne sans connexion internet
 */

interface LocalResponse {
  category: string;
  keywords: string[];
  responses: string[];
}

export class AICoachLocalService {
  private localResponses: LocalResponse[] = [
    {
      category: 'motivation',
      keywords: ['motivation', 'motiver', 'découragé', 'envie', 'flemme', 'fatigue'],
      responses: [
        "💪 Chaque répétition compte ! Même 5 minutes d'exercice valent mieux que rien.",
        "🌟 Rappelez-vous pourquoi vous avez commencé. Votre futur vous remerciera !",
        "🔥 La motivation suit l'action. Commencez petit et l'énergie viendra.",
        "🎯 Vous avez déjà fait le plus dur : décider de prendre soin de vous.",
        "⚡ L'énergie que vous ressentez après l'exercice vaut chaque effort !"
      ]
    },
    {
      category: 'debutant',
      keywords: ['débutant', 'commencer', 'débuter', 'nouveau', 'première fois'],
      responses: [
        "🌱 Bienvenue ! Commencez avec 5-10 répétitions par exercice et augmentez progressivement.",
        "📈 La clé pour les débutants : régularité > intensité. Mieux vaut peu mais souvent.",
        "✅ Conseil : Maîtrisez d'abord la forme avant d'augmenter les répétitions.",
        "🎯 Objectif débutant : 3 séries de 5 répétitions pour chaque exercice.",
        "💡 Écoutez votre corps. Une légère fatigue est normale, la douleur ne l'est pas."
      ]
    },
    {
      category: 'technique',
      keywords: ['technique', 'comment', 'forme', 'position', 'faire', 'correctement'],
      responses: [
        "🏋️ Pompes : Gardez le corps droit, descendez jusqu'à ce que la poitrine frôle le sol.",
        "🦵 Squats : Pieds largeur épaules, descendez comme pour vous asseoir, genoux alignés avec les pieds.",
        "🔥 Burpees : Squat → planche → pompe → retour squat → saut. Respirez !",
        "💡 Astuce : Faites l'exercice devant un miroir pour vérifier votre forme.",
        "⚠️ Important : La qualité prime sur la quantité. Mieux vaut 5 bonnes répétitions que 20 mauvaises."
      ]
    },
    {
      category: 'progression',
      keywords: ['progrès', 'progression', 'améliorer', 'augmenter', 'niveau', 'avancer'],
      responses: [
        "📊 Augmentez de 2-3 répétitions par semaine pour une progression sûre.",
        "🎯 Règle des 10% : N'augmentez jamais votre volume de plus de 10% par semaine.",
        "💪 Plateau ? Variez : changez le tempo, l'angle ou ajoutez une pause en bas.",
        "🌟 Après 4 semaines régulières, vous devriez pouvoir doubler vos répétitions initiales.",
        "📈 Tenez un journal : notez vos répétitions pour visualiser vos progrès."
      ]
    },
    {
      category: 'douleur',
      keywords: ['douleur', 'mal', 'blessure', 'courbature', 'récupération'],
      responses: [
        "🩹 Douleur aiguë = STOP immédiat. Courbatures = normal après l'effort.",
        "🧊 Courbatures : repos actif (marche), hydratation et étirements légers.",
        "⏸️ En cas de douleur : 48-72h de repos pour la zone concernée.",
        "💧 La récupération passe par : sommeil (7-9h), eau (2L/jour), protéines.",
        "⚠️ Consultez un professionnel si la douleur persiste plus de 72h."
      ]
    },
    {
      category: 'nutrition',
      keywords: ['manger', 'nutrition', 'alimentation', 'protéine', 'repas', 'diet'],
      responses: [
        "🥗 Mangez des protéines dans les 2h après l'exercice pour optimiser la récupération.",
        "💧 Hydratation : 500ml d'eau par heure d'exercice + votre consommation normale.",
        "🍌 Pré-exercice : glucides simples (fruit). Post-exercice : protéines + glucides.",
        "🥚 Sources de protéines : œufs, poulet, poisson, légumineuses, yaourt grec.",
        "⚖️ Équilibre : 40% glucides, 30% protéines, 30% lipides pour un sportif actif."
      ]
    },
    {
      category: 'temps',
      keywords: ['temps', 'durée', 'combien', 'minutes', 'fréquence', 'souvent'],
      responses: [
        "⏱️ 15-20 minutes par jour suffisent pour voir des résultats en 4 semaines.",
        "📅 Fréquence idéale : 5 jours actifs, 2 jours de repos par semaine.",
        "🎯 Mieux vaut 10 minutes tous les jours que 1 heure une fois par semaine.",
        "⚡ Sessions courtes mais intenses (HIIT) = résultats maximaux en minimum de temps.",
        "🌅 Le meilleur moment ? Celui où vous êtes sûr de le faire régulièrement."
      ]
    },
    {
      category: 'general',
      keywords: [],
      responses: [
        "💪 Continuez comme ça ! Chaque jour compte dans votre parcours fitness.",
        "🌟 Vous êtes sur la bonne voie. La consistance est la clé du succès.",
        "🎯 Fixez-vous des objectifs SMART : Spécifiques, Mesurables, Atteignables, Réalistes, Temporels.",
        "🔥 N'oubliez pas : le fitness est un marathon, pas un sprint.",
        "✨ Célébrez chaque petite victoire. Elles mènent aux grandes transformations."
      ]
    }
  ];

  /**
   * Trouve la meilleure réponse basée sur le message de l'utilisateur
   */
  getLocalResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Chercher la catégorie la plus pertinente
    for (const category of this.localResponses) {
      if (category.keywords.length > 0) {
        const hasKeyword = category.keywords.some(keyword => 
          lowerMessage.includes(keyword.toLowerCase())
        );
        
        if (hasKeyword) {
          // Retourner une réponse aléatoire de cette catégorie
          return this.getRandomResponse(category.responses);
        }
      }
    }
    
    // Si aucune catégorie spécifique, retourner une réponse générale
    const generalCategory = this.localResponses.find(cat => cat.category === 'general');
    return this.getRandomResponse(generalCategory?.responses || ['Je suis là pour vous aider !']);
  }

  /**
   * Retourne une réponse aléatoire d'un tableau
   */
  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Vérifie si le message nécessite une réponse cloud
   */
  needsCloudResponse(message: string): boolean {
    // Patterns qui nécessitent une réponse personnalisée
    const cloudPatterns = [
      /programme\s+personnalisé/i,
      /plan\s+d'entraînement/i,
      /analyse.*performance/i,
      /conseil.*spécifique/i,
      /problème.*santé/i,
      /blessure.*grave/i
    ];

    return cloudPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Message d'explication pour le mode cloud
   */
  getCloudExplanation(): string {
    return `🌐 Cette question nécessite une analyse personnalisée. 

Pour une réponse détaillée, je peux me connecter à notre service cloud sécurisé. 
Vos données resteront anonymes et chiffrées.

Souhaitez-vous activer temporairement le mode en ligne ?`;
  }
}

export const aiCoachLocal = new AICoachLocalService();