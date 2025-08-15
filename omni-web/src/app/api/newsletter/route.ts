import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Email invalide' }, { status: 400 });
    }

    // L'URL du webhook n8n sera configurée comme variable d'environnement dans Coolify
    const n8nWebhookUrl = process.env.N8N_NEWSLETTER_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      // Utiliser l'URL de test fournie par l'utilisateur pour le développement si la variable n'est pas définie
      // REMPLACER PAR L'URL DE PRODUCTION LORS DU DÉPLOIEMENT
      console.warn(
        "N8N_NEWSLETTER_WEBHOOK_URL non configurée. Utilisation de l'URL de test pour le développement.",
      );
      // Pour le développement, vous pouvez utiliser l'URL de test directement ici
      // n8nWebhookUrl = 'https://n8n.omnirealm.tech/webhook-test/newsletter-subscribe-omnirealm';
      return NextResponse.json(
        {
          message: 'Erreur de configuration du serveur: URL du webhook n8n manquante.',
        },
        { status: 500 },
      );
    }

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (n8nResponse.ok) {
      return NextResponse.json({ message: 'Inscription réussie !' }, { status: 200 });
    } else {
      const errorData = await n8nResponse.json();
      console.error('Erreur n8n :', errorData);
      return NextResponse.json(
        {
          message: errorData.message || "Erreur lors de l'inscription via n8n",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du formulaire :", error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
