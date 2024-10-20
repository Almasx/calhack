import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Summary } from "~/lib/db/queries";
import { formatTime } from "~/lib/agora/utils";
import { X } from "lucide-react";
import { useLatestSummaries } from "./hook";

export const Notes = ({
  summaries: initialSummaries,
}: {
  summaries: Summary[];
}) => {
  const { summaries, setSummaries } = useLatestSummaries(initialSummaries);

  const handleDeleteNote = async (id: string) => {
    setSummaries(summaries.filter((summary) => summary._id !== id));

    try {
      const response = await fetch(`/api/summary/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // If deletion fails, revert the optimistic update
        setSummaries(initialSummaries);
        console.error("Failed to delete note");
      }
    } catch (error) {
      // If there's an error, revert the optimistic update
      setSummaries(initialSummaries);
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="bg-[#101010] rounded-xl p-0.5 flex flex-col gap-0.5">
      <div className="p-2.5 text-lg text-neutral-400">Meeting notes</div>
      <div className="flex flex-col gap-0.5 overflow-y-auto h-[calc(100vh-270px)] rounded-xl">
        <AnimatePresence>
          {summaries.map((summary) => (
            <Note
              key={summary._id}
              time={{
                start: formatTime(+summary.timestamp),
                end: formatTime(+summary.timestamp + +summary.timestamp),
              }}
              content={summary}
              onDelete={() => handleDeleteNote(summary._id)}
            />
          ))}
        </AnimatePresence>
        <ListeningIndicator />
      </div>
    </div>
  );
};

const Note = ({
  time,
  content,
  onDelete,
}: {
  time: { start: string; end: string };
  content: Summary;
  onDelete: () => void;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="pr-1.5 pt-1.5 pb-2.5 pl-2.5 flex flex-col gap-2 text-neutral-500 relative bg-neutral-900 rounded-[10px] text-sm"
    >
      <div className="flex gap-1 text-xs">
        <span className="px-1 py-0.5 bg-neutral-800 rounded-md">
          {time.start}
        </span>
        <span className="px-1 py-0.5 bg-neutral-800 rounded-md">
          {time.end}
        </span>
      </div>
      <p>{content.summary}</p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: +hover }}
        onClick={onDelete}
        className="absolute right-1.5 top-1.5 bg-neutral-800 duration-150 ease-out hover:bg-neutral-700 rounded-full size-5 flex items-center justify-center text-white"
      >
        <X className="w-3 h-3 " />
      </motion.button>
    </div>
  );
};

const ListeningIndicator = () => {
  return (
    <motion.div
      className="pr-1.5 pt-1.5 pb-2.5 pl-2.5 bg-gradient-to-br from-[#171717] via-[#171717] to-neutral-900 flex h-14 justify-center items-center gap-2 text-neutral-500 rounded-[10px] text-sm"
      animate={{
        boxShadow: [
          "inset 0 0 20px 0 rgba(44, 44, 44, 1)",
          "inset 0 0 30px 0 rgba(44, 44, 44, 0.5)",
          "inset 0 0 20px 0 rgba(44, 44, 44, 1)",
        ],
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <motion.div
        className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full items-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <span>Listening and waiting for 1 min</span>
    </motion.div>
  );
};
