import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: 'info@dezainahub.com',
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export function generateApplicationConfirmationEmail(name: string, position: string) {
  return {
    subject: `Application Received for ${position}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <img src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741675497/Dezainahub_Logo_1_gtugu3.png" alt="Dezainahub Logo" style="max-width: 200px; margin-bottom: 20px;" />
        <h2>Thank you for your application, ${name}!</h2>
        <p>We have received your application for the position of ${position}.</p>
        <p>Our team will review your application and get back to you soon.</p>
        <br/>
        <p>Best regards,</p>
        <p>The Hiring Team</p>
        <p>Dezainahub</p>
      </div>
    `
  };
}