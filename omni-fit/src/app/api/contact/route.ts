import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation basique
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    // Envoi de l'email
    const emailResponse = await resend.emails.send({
      from: "contact@omnirealm.tech", // Adresse expéditrice
      to: "contact@omnirealm.tech", // Ton adresse email
      replyTo: email, // L'utilisateur peut être contacté directement
      subject: `[Contact OmniFit] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #00D9B1, #00B89F); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Nouveau message de contact OmniFit</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <div style="margin-bottom: 15px;">
              <strong style="color: #2D3436;">Nom :</strong>
              <span style="color: #636E72;">${name}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #2D3436;">Email :</strong>
              <a href="mailto:${email}" style="color: #00D9B1;">${email}</a>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #2D3436;">Sujet :</strong>
              <span style="color: #636E72;">${subject}</span>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #2D3436;">Message :</strong>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #00D9B1;">
              <p style="margin: 0; color: #2D3436; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
            </div>
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e9ecef; font-size: 12px; color: #636E72;">
              <p style="margin: 0;">
                💡 Tu peux répondre directement à cet email pour contacter ${name}.<br>
                📧 Email envoyé depuis le formulaire de contact OmniFit
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("✅ Email envoyé avec succès:", emailResponse);

    return NextResponse.json(
      {
        success: true,
        message: "Message envoyé avec succès !",
        emailId: emailResponse.data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);

    return NextResponse.json(
      {
        error: "Erreur lors de l'envoi du message",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
