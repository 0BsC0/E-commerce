const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendNotificacion = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `OrquideaViva <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Notificación enviada a:", to);
  } catch (err) {
    console.error("❌ Error al enviar notificación:", err);
  }
};
