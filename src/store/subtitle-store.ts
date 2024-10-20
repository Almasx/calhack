/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/store.ts
import { create } from "zustand";
import { ITextstream } from "~/app/hook/utils";

export interface ITextItem {
  dataType: "transcribe" | "translate";
  uid: string | number;
  username: string;
  text: string;
  lang: string;
  isFinal: boolean;
  time: number;
  startTextTs: number;
  textTs: number;
  translations?: { lang: string; text: string }[];
}

interface SubtitlesState {
  subtitles: ITextItem[];
  updateSubtitles: (textstream: ITextstream, username: string) => void;
}

async function saveSubtitleToDB(subtitle: ITextItem) {
  try {
    const response = await fetch("/api/subtitles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subtitle),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to save subtitle to MongoDB");
    }

    console.log("Subtitle saved to MongoDB:", await response.json());
  } catch (error) {
    console.error("Error saving subtitle to MongoDB:", error);
  }
}

export const useSubtitlesStore = create<SubtitlesState>((set) => ({
  subtitles: [],
  updateSubtitles: (textstream, username) =>
    set((state) => {
      const { dataType, culture, uid, textTs, words } = textstream;

      if (dataType === "transcribe") {
        let textStr = "";
        let isFinal = false;

        words.forEach((word: any) => {
          textStr += word.text;
          if (word.isFinal) {
            isFinal = true;
          }
        });

        const existingSubtitleIndex = state.subtitles.findLastIndex(
          (el) => el.uid === uid && !el.isFinal
        );

        if (existingSubtitleIndex === -1) {
          // Add new subtitle
          const newSubtitle: ITextItem = {
            dataType: "transcribe",
            uid,
            username,
            text: textStr,
            lang: culture,
            isFinal,
            time: textTs, // Use textTs directly for the time
            startTextTs: textTs,
            textTs,
          };

          // Save the final subtitle to MongoDB
          if (isFinal) {
            saveSubtitleToDB(newSubtitle);
          }

          return { subtitles: [...state.subtitles, newSubtitle] };
        } else {
          // Update existing subtitle
          const updatedSubtitles = [...state.subtitles];
          updatedSubtitles[existingSubtitleIndex] = {
            ...updatedSubtitles[existingSubtitleIndex],
            text: textStr,
            isFinal,
            time: textTs, // Update time with textTs
            textTs,
          };

          // Save the final subtitle to MongoDB if it's now final
          if (isFinal) {
            saveSubtitleToDB(updatedSubtitles[existingSubtitleIndex]);
          }

          return { subtitles: updatedSubtitles };
        }
      } else if (dataType === "translate") {
        // Handle translation logic here if needed
        return state;
      }

      return state;
    }),
}));
