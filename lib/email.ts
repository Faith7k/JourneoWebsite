import nodemailer from 'nodemailer';

export interface SendContactEmailParams {
  name: string;
  email: string;
  message: string;
  locale?: string | null;
}

export async function sendContactEmail({
  name,
  email,
  message,
  locale = 'tr',
}: SendContactEmailParams): Promise<{ success: boolean; error?: string }> {
  const targetEmail = process.env.CONTACT_EMAIL_TO || 'hello@journeo.ai';
  const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpSecure = process.env.SMTP_SECURE !== 'false'; // default to true for port 465
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `"Journeo İletişim Formu" <${smtpUser || 'hello@journeo.ai'}>`;
  const resendApiKey = process.env.RESEND_API_KEY;

  // 1. If Resend API Key is available
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: smtpFrom,
          to: [targetEmail],
          reply_to: email,
          subject: `[Journeo İletişim] ${name}`,
          html: buildHtmlEmail({ name, email, message, locale }),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Resend email failed:', errorData);
        return { success: false, error: errorData.message || 'Resend error' };
      }

      return { success: true };
    } catch (err) {
      console.error('Resend exception:', err);
      return { success: false, error: String(err) };
    }
  }

  // 2. If SMTP Credentials (e.g. Hostinger SMTP) are available
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: targetEmail,
        replyTo: `"${name}" <${email}>`,
        subject: `[Journeo İletişim Formu] ${name}`,
        text: `Yeni İletişim Mesajı\n\nAd Soyad: ${name}\nE-posta: ${email}\nDil: ${locale || 'tr'}\n\nMesaj:\n${message}`,
        html: buildHtmlEmail({ name, email, message, locale }),
      });

      return { success: true };
    } catch (err) {
      console.error('SMTP email dispatch error:', err);
      return { success: false, error: String(err) };
    }
  }

  // 3. Fallback when credentials are not yet set in environment
  console.warn(
    `[Email Service Warning] E-posta gönderimi için SMTP (SMTP_USER & SMTP_PASS) veya Resend (RESEND_API_KEY) tanımlı değil. Mesaj Supabase veritabanına kaydedildi. Hedef: ${targetEmail}`
  );
  return {
    success: false,
    error: 'E-posta servisi ayarlanmadı. Mesaj veritabanına kaydedildi.',
  };
}

function buildHtmlEmail({ name, email, message, locale }: SendContactEmailParams): string {
  const sanitizedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%); padding: 24px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
          .content { padding: 32px 24px; }
          .field { margin-bottom: 20px; }
          .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 6px; }
          .value { font-size: 16px; color: #f1f5f9; font-weight: 500; }
          .message-box { background: #0f172a; border-radius: 12px; padding: 20px; border: 1px solid #334155; color: #e2e8f0; font-size: 15px; line-height: 1.6; margin-top: 8px; }
          .footer { padding: 20px 24px; background: #0f172a; text-align: center; border-top: 1px solid #334155; }
          .reply-button { display: inline-block; background: #3b82f6; color: #ffffff !important; font-weight: 600; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Journeo - Yeni İletişim Mesajı</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Gönderen</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">E-Posta Adresi</div>
              <div class="value"><a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a></div>
            </div>
            <div class="field">
              <div class="label">Dil / Konum</div>
              <div class="value">${(locale || 'tr').toUpperCase()}</div>
            </div>
            <div class="field">
              <div class="label">Mesaj İçeriği</div>
              <div class="message-box">${sanitizedMessage}</div>
            </div>
            <div style="text-align: center; margin-top: 28px;">
              <a href="mailto:${email}" class="reply-button">Yanıtla (${email})</a>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0; font-size: 12px; color: #64748b;">Bu mesaj Journeo web sitesindeki iletişim formundan otomatik olarak hello@journeo.ai adresine gönderilmiştir.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
