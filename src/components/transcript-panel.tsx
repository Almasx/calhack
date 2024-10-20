import { useMemo } from "react";
import { formatTime } from "~/lib/agora/utils";
import { ITextItem, useSubtitlesStore } from "~/store/subtitle-store";

export const Transcripts = ({
  initialSubtitles,
}: {
  initialSubtitles: ITextItem[];
}) => {
  const incomingSubtitles = useSubtitlesStore((state) => state.subtitles);
  const subtitles = useMemo(() => {
    return [...initialSubtitles, ...incomingSubtitles];
  }, [initialSubtitles, incomingSubtitles]);

  return (
    <div className="bg-[#101010] rounded-xl p-0.5 pb-3 flex flex-col gap-0.5">
      <div className="p-2.5 text-lg text-neutral-400">Transcripts</div>
      {subtitles.length === 0 && (
        <div className="text-neutral-500 text-sm px-2.5 py-5">
          No transcripts yet
        </div>
      )}
      <div className="flex overflow-y-scroll gap-0.5 flex-col h-[calc(100vh-100px)] rounded-xl">
        {subtitles.map((subtitle, index) => (
          <Transcript key={index} subtitle={subtitle} />
        ))}
      </div>
    </div>
  );
};

const Transcript: React.FC<{ subtitle: ITextItem }> = ({ subtitle }) => {
  return (
    <div className="px-2.5 py-3 flex gap-5 duration-150  ease-out text-neutral-500 hover:bg-neutral-900 rounded-[10px] hover:text-white text-sm">
      <span className="text-xs">{formatTime(subtitle.time)}</span>
      <p>
        {subtitle.username}: {subtitle.text}
      </p>
    </div>
  );
};
