import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("carrierportal");
    
    // Get email and new status from request body
    const { email, status } = await request.json();

    // Validate required fields
    if (!email || !status) {
      return NextResponse.json({
        success: false,
        message: 'Email and status are required'
      }, { status: 400 });
    }

    const result = await db.collection("applications").updateOne(
      { email: email.toLowerCase() }, 
      {
        $set: {
          status: status, 
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'No application found with this email'
      }, { status: 404 });
    }

    if (result.modifiedCount === 1) {
      return NextResponse.json({
        success: true,
        message: 'Status updated successfully',
        status: status,
        email: email,
        lastUpdated: new Date()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'No changes made'
      }, { status: 304 });
    }

  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}