import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const summaries = [
  "Almas mentioned Hello and welcome! I'm Hokiman, the CEO of Meeting.al.",
  "John discussed the new product features coming in Q3.",
  "Sarah presented the financial report for the last quarter.",
  "The team agreed on the timeline for the upcoming project launch.",
];

export const Summary = () => {
  const [currentSummary, setCurrentSummary] = useState(summaries[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * summaries.length);
      setCurrentSummary(summaries[randomIndex]);
    }, Math.random() * 2000 + 2000); // Random interval between 5-10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b text-[#33DBC6] gap-8 p-3 from-[#002421]/20 to-[#07615A]/20 rounded-xl flex flex-col shadow-[inset_0_0_24px_rgba(51,220,198,0.25)]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={currentSummary}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.5, type: "spring", bounce: 0 }}
          className="text-xl leading-tight"
        >
          {currentSummary}
        </motion.span>
      </AnimatePresence>
      <span className="bg-[#06332D] px-2 py-1 rounded-md text-xs mr-auto">
        Main idea
      </span>
    </div>
  );
};
