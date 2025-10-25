import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../lib/mongodb";
import {
  sendEmail,
  generateApplicationConfirmationEmail,
  generateAdminApplicationNotificationEmail,
} from "../../lib/email";

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();
    const {
      name,
      email,
      phoneNumber,
      portfolio,
      jobTitle,
      resumeUrl,
      experience,
    } = applicationData;

    if (!name || !email || !phoneNumber || !jobTitle || !resumeUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection("applications");

    const result = await collection.insertOne({
      name,
      email,
      phoneNumber,
      portfolio,
      resumeUrl,
      jobTitle,
      experience,
      submittedAt: new Date(),
      status: "Pending",
    });

    // Send confirmation email to applicant
    try {
      const confirmationEmail = generateApplicationConfirmationEmail(
        name,
        jobTitle
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
      const adminEmail = generateAdminApplicationNotificationEmail(
        name,
        jobTitle,
        email,
        phoneNumber
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
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection("applications");

    const applications = await collection.find({}).toArray();

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
