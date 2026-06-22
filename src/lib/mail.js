import nodemailer from 'nodemailer';

let transporter = null;

export function getMailer() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.MAILHOG_HOST,
      port: process.env.MAILHOG_PORT,
      secure: false,
    });
  }
  return transporter;
}

export async function sendMagicLink(email, token) {
  const mailer = getMailer();
  const link = `${process.env.APP_URL}/auth/verify?token=${token}`;

  const mailOptions = {
    from: process.env.MAILHOG_FROM || 'noreply@apuestas.local',
    to: email,
    subject: '🎯 Tu enlace mágico para Apuestas Deportivas',
    html: `
      <h2>¡Bienvenido a Apuestas Deportivas!</h2>
      <p>Haz click en el enlace de abajo para acceder:</p>
      <a href="${link}" style="display: inline-block; padding: 10px 20px; background: #4a90e2; color: white; text-decoration: none; border-radius: 5px;">
        Acceder
      </a>
      <p>O copia este enlace en tu navegador:</p>
      <p>${link}</p>
      <p>Este enlace expira en 7 días.</p>
    `,
  };

  try {
    await mailer.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
}
