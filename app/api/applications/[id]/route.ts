import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid application id" }, { status: 400 });
    }
    const db = await getDatabase();

    const result = await db
      .collection("applications")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid application id" }, { status: 400 });
    }
    const db = await getDatabase();

    const { status } = await request.json();
    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

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
        { message: "Application not found" },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 1) {
      return NextResponse.json(
        { message: "Status updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No changes made" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
