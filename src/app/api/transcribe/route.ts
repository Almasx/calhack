// ~/app/api/transcription/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  apiSTTStartTranscription,
  apiSTTStopTranscription,
  apiSTTAcquireToken,
} from "~/lib/agora/utils";

// POST: Start Transcription
export async function POST(request: NextRequest) {
  try {
    const { channel } = await request.json();
    const { taskId, builderToken } = await handleStartTranscription(channel);
    return NextResponse.json({ taskId, builderToken });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE: Stop Transcription
export async function DELETE(request: NextRequest) {
  try {
    const { taskId, builderToken, channel, uid } = await request.json();
    await apiSTTStopTranscription({
      taskId,
      token: builderToken,
      uid,
      channel,
    });
    return NextResponse.json({ message: "Transcription stopped successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Helper: Start Transcription Logic
async function handleStartTranscription(channel: string) {
  const uid = "almas"; // Example UID, ideally this should come from the client
  const tokenData = await apiSTTAcquireToken({ channel, uid });
  console.log(tokenData);

  const { taskId } = await apiSTTStartTranscription({
    uid,
    channel,
    token: tokenData.tokenName,
  });

  return { taskId, builderToken: tokenData.tokenName };
}
