"use client";

import React from "react";
import { useSubtitlesStore } from "~/lib/store";

const SubtitlesDisplay: React.FC = () => {
  const subtitles = useSubtitlesStore((state) => state.subtitles);

  return (
    <div className="p-2 pt-20 top-0 w-96 bg-white text-black overflow-y-auto h-screen">
      {subtitles.map((subtitle, index) => (
        <div key={index}>
          <strong>{subtitle.username}:</strong> {subtitle.text}
          {subtitle.translations &&
            subtitle.translations.map((translation, tIndex) => (
              <div key={tIndex}>
                <em>{translation.lang}:</em> {translation.text}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default SubtitlesDisplay;
