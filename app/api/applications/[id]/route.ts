import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Received delete request for user id:', params.id);
  try {
    const client = await clientPromise;
    const db = client.db("carrierportal");
    const { id } = params;

    const result = await db.collection("applications").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("carrierportal");
    const { id } = params;

    // Get the new status from request body
    const { status } = await request.json();

    const result = await db.collection("applications").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: status,
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 1) {
      return NextResponse.json(
        { message: 'Status updated successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'No changes made' },
        { status: 304 }
      );
    }
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}