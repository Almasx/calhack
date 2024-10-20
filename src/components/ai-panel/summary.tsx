import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headline } from "~/lib/db/queries";

interface SummaryProps {
  headlines: Headline[];
}

export const Summary: React.FC<SummaryProps> = ({ headlines }) => {
  const [currentHeadline, setCurrentHeadline] = useState<Headline | null>(
    headlines[0] || null
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * headlines.length);
      setCurrentHeadline(headlines[randomIndex]);
    }, Math.random() * 2000 + 2000); // Random interval between 2-4 seconds

    return () => clearInterval(interval);
  }, [headlines]);

  return (
    <div className="bg-gradient-to-b text-[#33DBC6] gap-8 p-3 from-[#002421]/20 to-[#07615A]/20 rounded-xl flex flex-col shadow-[inset_0_0_24px_rgba(51,220,198,0.25)]">
      <AnimatePresence mode="popLayout">
        {currentHeadline && (
          <motion.span
            key={currentHeadline._id}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5, type: "spring", bounce: 0 }}
            className="text-xl leading-tight"
          >
            {currentHeadline.text}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="bg-[#06332D] px-2 py-1 rounded-md text-xs mr-auto">
        Main idea
      </span>
    </div>
  );
};
