import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("career_portal");
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    const { isVisible } = await request.json();

    const result = await db.collection("jobs").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isVisible,
        },
      }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error toggling job visibility:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle job visibility" },
      { status: 500 }
    );
  }
}
