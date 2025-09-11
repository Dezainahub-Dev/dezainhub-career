import { NextResponse } from 'next/server';
import { AutomatedHiringSystem } from '../../dashboard/helper/candidateEvaluation';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("career_portal");
    
    const application = await request.json();
    const jobId = application.jobId;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Fetch job requirements
    const job = await db.collection("jobs").findOne({ 
      _id: new ObjectId(jobId) 
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    const requirements = {
      title: job.jobTitle,
      requiredSkills: Array.isArray(job.Tags) ? job.Tags : [],
      minimumExperience: parseInt(job.exp) || 0,
      jobType: job.jobType,
      workType: job.workType
    };

    const candidateData = {
      name: application.name,
      email: application.email,
      resumeUrl: application.resumeUrl,
      experience: application.experience,
      jobTitle: job.jobTitle,
      skills: Array.isArray(job.Tags) ? job.Tags : []
    };

    const hiringSystem = new AutomatedHiringSystem();
    await hiringSystem.evaluateCandidate(candidateData, requirements);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Evaluation failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to evaluate candidate'
      },
      { status: 500 }
    );
  }
}