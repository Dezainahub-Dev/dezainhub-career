import { NextRequest, NextResponse } from "next/server";
import { testEmailConfiguration, sendEmail } from "../../lib/email";

export async function GET() {
  try {
    const result = await testEmailConfiguration();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email configuration is valid",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error testing email configuration:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test email configuration",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        {
          error: "Missing required fields: to, subject, message",
        },
        { status: 400 }
      );
    }

    const testEmail = {
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>${message}</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p>This is a test email from your Dezainahub Career Portal.</p>
        </div>
      `,
    };

    const result = await sendEmail(testEmail);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test email",
      },
      { status: 500 }
    );
  }
}
