import clientPromise from "~/lib/mongodb";
import { ITextItem } from "~/store/subtitle-store";

export async function getSubtitles(): Promise<ITextItem[]> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "myproject");

  const subtitles = await db.collection("subtitles").find().toArray();
  return subtitles.map((subtitle) => ({
    dataType: "transcribe",
    uid: subtitle.uid,
    username: subtitle.username,
    text: subtitle.text,
    lang: subtitle.lang,
    isFinal: subtitle.isFinal,
    time: subtitle.time,
    startTextTs: subtitle.startTextTs,
    textTs: subtitle.textTs,
  }));
}

export interface Summary {
  _id: string;
  summary: string;
  timestamp: Date;
}

export async function getSummaries(): Promise<Summary[]> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "myproject");

  const summaries = await db.collection("summary").find().toArray();
  return summaries.map((summary) => ({
    _id: summary._id.toString(),
    summary: summary.summary,
    timestamp: summary.timestamp,
  }));
}
