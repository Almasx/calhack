// app/api/subtitles/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "~/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "myproject");

    const subtitle = await request.json();
    const result = await db.collection("subtitles").insertOne(subtitle);

    return NextResponse.json(
      { message: "Subtitle saved", data: result },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving subtitle:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "myproject");

    const subtitles = await db.collection("subtitles").find().toArray();
    return NextResponse.json(subtitles, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching subtitles:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
