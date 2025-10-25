// Simple test script to verify email configuration
// Run with: node test-email.js

const nodemailer = require('nodemailer');

// Test email configuration
async function testEmail() {
    const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        // Verify connection
        console.log("Testing email configuration...");
        await transporter.verify();
        console.log("✅ Email configuration is valid!");

        // Send test email
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || "info@dezainahub.com",
            to: process.env.ADMIN_EMAIL || "varidhsrivastava19145@gmail.com",
            subject: "Test Email - Admin Login Notification",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>This is a test email to verify your email configuration.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p>If you receive this email, your email configuration is working correctly!</p>
        </div>
      `
        });

        console.log("✅ Test email sent successfully!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("❌ Email test failed:", error.message);
        console.error("Full error:", error);
    }
}

testEmail();
