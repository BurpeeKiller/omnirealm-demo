import { NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function validateContactForm(data: ContactFormData): string[] {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Le nom est requis');
  }

  if (!data.email?.trim()) {
    errors.push("L'email est requis");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("L'email n'est pas valide");
  }

  if (!data.subject?.trim()) {
    errors.push('Le sujet est requis');
  }

  if (!data.message?.trim()) {
    errors.push('Le message est requis');
  } else if (data.message.trim().length < 10) {
    errors.push('Le message doit contenir au moins 10 caractères');
  }

  return errors;
}

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json();

    // Validation des données
    const validationErrors = validateContactForm(data);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { message: 'Données invalides', errors: validationErrors },
        { status: 400 },
      );
    }

    // L'URL du webhook n8n sera configurée comme variable d'environnement
    const n8nWebhookUrl = process.env.N8N_CONTACT_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      console.warn('N8N_CONTACT_WEBHOOK_URL non configurée.');
      return NextResponse.json(
        {
          message: 'Erreur de configuration du serveur: URL du webhook contact manquante.',
        },
        { status: 500 },
      );
    }

    // Envoi vers n8n avec validation supplémentaire
    const n8nPayload = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      timestamp: new Date().toISOString(),
      source: 'omnirealm-website',
    };

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload),
    });

    if (n8nResponse.ok) {
      return NextResponse.json({ message: 'Message envoyé avec succès !' }, { status: 200 });
    } else {
      const errorData = await n8nResponse.text();
      console.error('Erreur n8n contact :', errorData);
      return NextResponse.json({ message: "Erreur lors de l'envoi du message" }, { status: 500 });
    }
  } catch (error) {
    console.error('Erreur lors du traitement du formulaire de contact :', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
