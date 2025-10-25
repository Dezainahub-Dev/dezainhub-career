import nodemailer from "nodemailer";

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    console.log("Attempting to send email to:", to);
    console.log("Subject:", subject);

    // Check if required environment variables are set
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("SMTP credentials not configured");
      return {
        success: false,
        error:
          "SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS environment variables.",
      };
    }

    // Verify connection configuration
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "info@dezainahub.com",
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  try {
    await transporter.verify();
    console.log("Email configuration is valid");
    return { success: true };
  } catch (error) {
    console.error("Email configuration test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Email templates
export function generateApplicationConfirmationEmail(
  name: string,
  position: string
) {
  return {
    subject: `Application Received for ${position}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <img src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741675497/Dezainahub_Logo_1_gtugu3.png" alt="Dezainahub Logo" style="max-width: 200px; margin-bottom: 20px;" />
        <h2 style="color: #333;">Thank you for your application, ${name}!</h2>
        <p>We have received your application for the position of <strong>${position}</strong>.</p>
        <p>Our team will review your application and get back to you soon.</p>
        <br/>
        <p>Best regards,</p>
        <p>The Hiring Team</p>
        <p>Dezainahub</p>
      </div>
    `,
  };
}

export function generateAdminApplicationNotificationEmail(
  applicantName: string,
  position: string,
  applicantEmail: string,
  applicantPhone: string
) {
  return {
    subject: `New Job Application - ${position}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <img src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741675497/Dezainahub_Logo_1_gtugu3.png" alt="Dezainahub Logo" style="max-width: 200px; margin-bottom: 20px;" />
        <h2 style="color: #333;">New Job Application Received</h2>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Application Details:</h3>
          <p><strong>Applicant Name:</strong> ${applicantName}</p>
          <p><strong>Position:</strong> ${position}</p>
          <p><strong>Email:</strong> ${applicantEmail}</p>
          <p><strong>Phone:</strong> ${applicantPhone}</p>
          <p><strong>Application Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Please review the application in the admin portal.</p>
        <br/>
        <p>Best regards,</p>
        <p>Dezainahub Career Portal</p>
      </div>
    `,
  };
}

export function generateSubmissionNotificationEmail(
  submitterName: string,
  assignmentTitle: string,
  submitterEmail: string
) {
  return {
    subject: `New Assignment Submission - ${assignmentTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <img src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741675497/Dezainahub_Logo_1_gtugu3.png" alt="Dezainahub Logo" style="max-width: 200px; margin-bottom: 20px;" />
        <h2 style="color: #333;">New Assignment Submission</h2>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Submission Details:</h3>
          <p><strong>Submitter Name:</strong> ${submitterName}</p>
          <p><strong>Assignment:</strong> ${assignmentTitle}</p>
          <p><strong>Email:</strong> ${submitterEmail}</p>
          <p><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Please review the submission in the admin portal.</p>
        <br/>
        <p>Best regards,</p>
        <p>Dezainahub Career Portal</p>
      </div>
    `,
  };
}

export function generateAdminLoginNotificationEmail(
  adminEmail: string,
  loginTime: string,
  ipAddress?: string
) {
  return {
    subject: `Admin Portal Login - ${new Date().toLocaleDateString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <img src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741675497/Dezainahub_Logo_1_gtugu3.png" alt="Dezainahub Logo" style="max-width: 200px; margin-bottom: 20px;" />
        <h2 style="color: #333;">Admin Portal Login</h2>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Login Details:</h3>
          <p><strong>Admin Email:</strong> ${adminEmail}</p>
          <p><strong>Login Time:</strong> ${loginTime}</p>
          ${ipAddress ? `<p><strong>IP Address:</strong> ${ipAddress}</p>` : ""}
        </div>
        <p>If this login was not authorized by you, please contact the system administrator immediately.</p>
        <br/>
        <p>Best regards,</p>
        <p>Dezainahub Security Team</p>
      </div>
    `,
  };
}

export function generateSubmissionConfirmationEmail(
  submitterName: string,
  assignmentTitle: string
) {
  return {
    subject: `Assignment Submission Confirmed - ${assignmentTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <img src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741675497/Dezainahub_Logo_1_gtugu3.png" alt="Dezainahub Logo" style="max-width: 200px; margin-bottom: 20px;" />
        <h2 style="color: #333;">Assignment Submission Confirmed</h2>
        <p>Dear ${submitterName},</p>
        <p>We have successfully received your submission for <strong>${assignmentTitle}</strong>.</p>
        <p>Our team will review your submission and get back to you soon.</p>
        <br/>
        <p>Best regards,</p>
        <p>The Evaluation Team</p>
        <p>Dezainahub</p>
      </div>
    `,
  };
}

export function generateSMTPUserLoginNotificationEmail(
  adminEmail: string,
  loginTime: string,
  ipAddress?: string
) {
  return {
    subject: `[SMTP User] Admin Portal Login - ${new Date().toLocaleDateString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <img src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741675497/Dezainahub_Logo_1_gtugu3.png" alt="Dezainahub Logo" style="max-width: 200px; margin-bottom: 20px;" />
        <h2 style="color: #333;">🔐 Admin Portal Login Notification</h2>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff;">
          <h3 style="margin-top: 0; color: #333;">Login Details:</h3>
          <p><strong>Admin Email:</strong> ${adminEmail}</p>
          <p><strong>Login Time:</strong> ${loginTime}</p>
          ${ipAddress ? `<p><strong>IP Address:</strong> ${ipAddress}</p>` : ""}
          <p><strong>Notification Type:</strong> SMTP User Alert</p>
        </div>
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h4 style="margin-top: 0; color: #856404;">⚠️ Security Notice</h4>
          <p style="color: #856404; margin: 0;">This email was sent to the SMTP user account to track all admin portal logins. If this login was not authorized, please contact the system administrator immediately.</p>
        </div>
        <p>This notification helps maintain security by tracking all administrative access to the system.</p>
        <br/>
        <p>Best regards,</p>
        <p>Dezainahub Security System</p>
      </div>
    `,
  };
}
