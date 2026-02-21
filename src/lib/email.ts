interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function sendContactNotification(data: ContactEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('RESEND_API_KEY non configuré — email non envoyé');
    return;
  }

  const to = process.env.CONTACT_EMAIL || 'contact@abp-partner.fr';
  const from = 'site@abp-partner.fr';

  const phoneLine = data.phone ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#1a1a2e;vertical-align:top;">Téléphone</td><td style="padding:8px 12px;">${data.phone}</td></tr>` : '';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;border-radius:8px;overflow:hidden;">
      <div style="background:#1a1a2e;padding:24px;text-align:center;">
        <h1 style="color:#c8a86e;margin:0;font-size:20px;">Nouveau message — ABP Partner</h1>
      </div>
      <div style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;background:white;border-radius:6px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <tr style="background:#f5f5f5;"><td style="padding:8px 12px;font-weight:bold;color:#1a1a2e;">Nom</td><td style="padding:8px 12px;">${data.name}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;color:#1a1a2e;">Email</td><td style="padding:8px 12px;"><a href="mailto:${data.email}" style="color:#c8a86e;">${data.email}</a></td></tr>
          ${phoneLine}
          ${data.subject ? `<tr style="background:#f5f5f5;"><td style="padding:8px 12px;font-weight:bold;color:#1a1a2e;">Sujet</td><td style="padding:8px 12px;">${data.subject}</td></tr>` : ''}
        </table>
        <div style="margin-top:20px;padding:16px;background:white;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <h3 style="margin:0 0 12px;color:#1a1a2e;font-size:14px;">Message :</h3>
          <p style="margin:0;color:#333;white-space:pre-wrap;line-height:1.6;">${data.message}</p>
        </div>
        <p style="margin-top:20px;font-size:12px;color:#999;text-align:center;">
          Envoyé depuis le formulaire de contact du site ABP Partner
        </p>
      </div>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `ABP Partner <site@abp-partner.fr>`,
      to,
      reply_to: data.email,
      subject: `[Contact ABP] ${data.subject || 'Nouveau message'} — ${data.name}`,
      html,
      text: `Nouveau message de ${data.name} (${data.email}${data.phone ? `, ${data.phone}` : ''})\n\n${data.subject ? `Sujet: ${data.subject}\n\n` : ''}${data.message}`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}
