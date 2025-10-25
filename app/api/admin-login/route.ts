import { NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  generateAdminLoginNotificationEmail,
  generateSMTPUserLoginNotificationEmail,
} from "../../lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email, ipAddress, uid } = await request.json();

    console.log("Admin login API called with:", { email, ipAddress, uid });

    if (!email) {
      console.error("Email is required");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const loginTime = new Date().toLocaleString();
    const adminEmail =
      process.env.ADMIN_EMAIL || "varidhsrivastava19145@gmail.com";
    const smtpUserEmail = process.env.SMTP_USER;

    console.log("Sending login notification to:", adminEmail);
    if (smtpUserEmail) {
      console.log("Also sending notification to SMTP user:", smtpUserEmail);
    }

    // Send login notification email to admin
    try {
      const loginEmail = generateAdminLoginNotificationEmail(
        email,
        loginTime,
        ipAddress
      );

      console.log("Generated email template:", loginEmail.subject);

      const emailResult = await sendEmail({
        to: adminEmail,
        subject: loginEmail.subject,
        html: loginEmail.html,
      });

      if (emailResult.success) {
        console.log(
          "Login notification email sent successfully to admin:",
          emailResult.messageId
        );
      } else {
        console.error(
          "Failed to send login notification email to admin:",
          emailResult.error
        );
      }
    } catch (emailError) {
      console.error(
        "Error sending login notification email to admin:",
        emailError
      );
    }

    // Send login notification email to SMTP user (if different from admin)
    if (smtpUserEmail && smtpUserEmail !== adminEmail) {
      try {
        const smtpUserEmailTemplate = generateSMTPUserLoginNotificationEmail(
          email,
          loginTime,
          ipAddress
        );

        console.log("Sending notification to SMTP user:", smtpUserEmail);

        const smtpUserEmailResult = await sendEmail({
          to: smtpUserEmail,
          subject: smtpUserEmailTemplate.subject,
          html: smtpUserEmailTemplate.html,
        });

        if (smtpUserEmailResult.success) {
          console.log(
            "Login notification email sent successfully to SMTP user:",
            smtpUserEmailResult.messageId
          );
        } else {
          console.error(
            "Failed to send login notification email to SMTP user:",
            smtpUserEmailResult.error
          );
        }
      } catch (smtpUserEmailError) {
        console.error(
          "Error sending login notification email to SMTP user:",
          smtpUserEmailError
        );
      }
    } else if (smtpUserEmail === adminEmail) {
      console.log(
        "SMTP user email is same as admin email, skipping duplicate notification"
      );
    } else {
      console.log("No SMTP user email configured");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error tracking admin login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
