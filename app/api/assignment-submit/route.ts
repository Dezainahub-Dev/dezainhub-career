import { NextResponse } from "next/server";
import { getDatabase } from "../../lib/mongodb";
import {
  sendEmail,
  generateSubmissionConfirmationEmail,
  generateSubmissionNotificationEmail,
} from "../../lib/email";

export async function POST(request: Request) {
  try {
    const { name, email, phone, position, figmaLink, googleDriveLink } =
      await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection("assignments");

    const result = await collection.insertOne({
      name,
      email,
      phone,
      position,
      figmaLink,
      googleDriveLink,
      submittedAt: new Date(),
    });

    // Send confirmation email to submitter
    try {
      const confirmationEmail = generateSubmissionConfirmationEmail(
        name,
        position
      );
      await sendEmail({
        to: email,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
      });
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
    }

    // Send notification email to admin
    try {
      const adminEmail = generateSubmissionNotificationEmail(
        name,
        position,
        email
      );
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "varidhsrivastava19145@gmail.com",
        subject: adminEmail.subject,
        html: adminEmail.html,
      });
    } catch (emailError) {
      console.error("Error sending admin notification email:", emailError);
    }

    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
