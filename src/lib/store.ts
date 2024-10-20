import { create } from "zustand";
import { ITextstream } from "~/app/hook/utils";

interface Subtitle {
  username: string;
  text: string;
  translations?: { lang: string; text: string }[];
}

interface SubtitlesState {
  subtitles: Subtitle[];
  addSubtitle: (textstream: ITextstream, username: string) => void;
}

export const useSubtitlesStore = create<SubtitlesState>((set) => ({
  subtitles: [],
  addSubtitle: (textstream, username) =>
    set((state) => ({
      subtitles: [
        ...state.subtitles,
        {
          username,
          text: textstream.words.map((w) => w.text).join(" "),
          translations: textstream.trans?.map((t) => ({
            lang: t.lang,
            text: t.texts.join(" "),
          })),
        },
      ],
    })),
}));
