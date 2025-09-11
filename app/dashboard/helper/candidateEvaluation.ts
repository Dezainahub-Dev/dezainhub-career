import { sendEmail } from "@/app/lib/email";

interface CandidateApplication {
  name: string;
  email: string;
  resumeUrl: string;
  experience: string;
  jobTitle: string;
  skills: string[];
}

interface JobRequirements {
  title: string;
  requiredSkills: string[];
  minimumExperience: number;
  jobType?: string;
  workType?: string;
  ctc?: string;
}

export class AutomatedHiringSystem {
  constructor() {
    // No need for AI setup anymore
  }

  async evaluateCandidate(
    application: CandidateApplication,
    requirements: JobRequirements
  ): Promise<void> {
    try {
      console.log('🎯 Processing application for:', {
        name: application.name,
        email: application.email,
        jobTitle: application.jobTitle,
      });
      
      // Simple validation - just check if basic info is provided
      if (!application.name || !application.email || !application.resumeUrl) {
        console.log('❌ Missing required information');
        throw new Error('Missing required application information');
      }
      
      console.log('✅ Application accepted - sending assignment email');
      
      // Wait 2 minutes before sending email (reduced from 5 minutes)
      setTimeout(async () => {
        console.log('📧 Sending assignment email...');
        await this.sendAssignmentEmail(application);
      }, 2 * 60 * 1000); // 2 minutes
      
    } catch (error) {
      console.error('❌ Evaluation failed:', error);
      throw new Error('Failed to process application');
    }
  }

  private async sendAssignmentEmail(application: CandidateApplication) {
    try {
      // Update application status to Selected
      const statusResponse = await fetch('http://career.dezainahub.com/api/applications/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: application.email,
          status: 'Selected'
        })
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to update application status');
      }
      
      const assignmentLink = `${process.env.ASSIGNMENT_BASE_URL}`;
      
      await sendEmail({
        to: application.email,
        subject: `Next Steps: Technical Assignment for ${application.jobTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <img src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741675497/Dezainahub_Logo_1_gtugu3.png" alt="Dezainahub Logo" style="max-width: 200px; margin-bottom: 20px;" />
            <h2>Thank you for your application, ${application.name}!</h2>
            <p>We've received your application for the ${application.jobTitle} position.</p>
            <p>As the next step, please complete our technical assessment within 48 hours:</p>
            <a href="${assignmentLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">
              Start Technical Assessment
            </a>
            <p><strong>Important:</strong> This link is valid for 48 hours from the time you receive this email.</p>
            <p>The assessment will help us understand your technical skills and problem-solving approach.</p>
            <p>Best regards,<br>The Hiring Team</p>
            <p>Dezainahub</p>
          </div>
        `
      });
      
      console.log('✅ Assignment email sent successfully to:', application.email);
      
    } catch (error) {
      console.error('❌ Error sending assignment email:', error);
      throw error;
    }
  }
}