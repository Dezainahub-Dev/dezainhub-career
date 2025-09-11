import { NextResponse } from 'next/server';
import { sendEmail, generateApplicationConfirmationEmail } from '../../lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, jobTitle } = await req.json();
    
    const emailTemplate = generateApplicationConfirmationEmail(name, jobTitle);
    
    await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}