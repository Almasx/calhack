import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "~/lib/mongodb";
import { getSummaries } from "~/lib/db/queries";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "myproject");
    const result = await db.collection("summary").deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Note not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Failed to delete note:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
