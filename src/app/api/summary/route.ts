import { NextResponse } from "next/server";
import { getSummaries } from "~/lib/db/queries";

export async function GET() {
  try {
    const summaries = await getSummaries();
    return NextResponse.json(summaries);
  } catch (error) {
    console.error("Error fetching summaries:", error);
    return NextResponse.json(
      { error: "Failed to fetch summaries" },
      { status: 500 }
    );
  }
}
