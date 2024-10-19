import { NextRequest, NextResponse } from "next/server";
import {
  generateCredential,
  startTranscription,
  stopTranscription,
} from "~/lib/agora/utils";

export async function POST(request: NextRequest) {
  const { channel } = await request.json();
  const credential = generateCredential();

  try {
    const [taskId, builderToken] = await startTranscription(
      channel,
      credential
    );
    return NextResponse.json({ taskId, builderToken });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { taskId, builderToken } = await request.json();
  const credential = generateCredential();

  try {
    const data = await stopTranscription(taskId, builderToken, credential);
    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
