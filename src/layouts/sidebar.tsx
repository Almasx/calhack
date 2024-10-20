"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Transcripts } from "../components/transcript-panel";
import { useUIStore } from "../store/ui-store";
import { AIPanel } from "~/components/ai-panel";
import { ITextItem } from "~/store/subtitle-store";
import { Headline, Summary } from "~/lib/db/queries";

const animation = { type: "spring", duration: 0.5, bounce: 0 };

export const Sidebar = ({
  initialSubtitles,
  summaries,
  headlines,
}: {
  initialSubtitles: ITextItem[];
  summaries: Summary[];
  headlines: Headline[];
}) => {
  const { isAIOpen, isTranscriptOpen } = useUIStore();

  const isOpen = isAIOpen || isTranscriptOpen;

  return (
    <motion.div
      className="relative overflow-hidden flex-shrink-0"
      animate={{ width: isOpen ? 320 : 0 }}
      transition={animation}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 320, width: 320 }}
            animate={{ x: 0, width: 320 }}
            exit={{ x: 320, width: 320 }}
            transition={animation}
            className="absolute top-0 left-0 w-80 h-full"
          >
            <div className="relative w-full h-full overflow-hidden">
              <motion.div
                animate={{ y: isAIOpen ? 0 : "-100%" }}
                transition={animation}
                className="absolute top-0 left-0 w-full h-full"
              >
                <div className="h-full overflow-y-auto gap-2 flex flex-col">
                  <AIPanel summaries={summaries} headlines={headlines} />
                </div>
              </motion.div>
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: isTranscriptOpen ? 0 : "100%" }}
                transition={animation}
                className="absolute top-0 left-0 w-full h-full"
              >
                <Transcripts initialSubtitles={initialSubtitles} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
