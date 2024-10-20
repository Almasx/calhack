import { create } from "zustand";
import { ITextstream } from "~/app/hook/utils";

interface ITextItem {
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

export const useSubtitlesStore = create<SubtitlesState>((set) => ({
  subtitles: [],
  updateSubtitles: (textstream, username) =>
    set((state) => {
      const { dataType, culture, uid, time, durationMs, textTs, words } =
        textstream;

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
            time: time + durationMs,
            startTextTs: textTs,
            textTs,
          };
          return { subtitles: [...state.subtitles, newSubtitle] };
        } else {
          // Update existing subtitle
          const updatedSubtitles = [...state.subtitles];
          updatedSubtitles[existingSubtitleIndex] = {
            ...updatedSubtitles[existingSubtitleIndex],
            text: textStr,
            isFinal,
            time: time + durationMs,
            textTs,
          };
          return { subtitles: updatedSubtitles };
        }
      } else if (dataType === "translate") {
        // Handle translation logic here if needed
        // This part would be similar to the 'translate' case in the original code
        return state;
      }

      return state;
    }),
}));
