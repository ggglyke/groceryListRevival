const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // STARTTLS sur le port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendPasswordResetEmail = async (email, username, resetUrl) => {
  await transporter.sendMail({
    from: `"Grocery List - Listes et listes de courses" <${process.env.MAIL_FROM}>`,
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <p>Bonjour ${username},</p>
      <p>Vous avez demandé la réinitialisation de votre mot de passe sur l'application de listes de Guillaume.</p>
      <p><a href="${resetUrl}">Cliquez ici pour choisir un nouveau mot de passe</a></p>
      <p>Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email : votre mot de passe restera inchangé.</p>
    `,
  });
};

module.exports = { sendPasswordResetEmail };
