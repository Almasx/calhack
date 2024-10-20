import { useState, useEffect } from "react";
import { Summary } from "~/lib/db/queries";

export function useLatestSummaries(initialSummaries: Summary[]) {
  const [summaries, setSummaries] = useState(initialSummaries);

  useEffect(() => {
    const fetchLatestSummaries = async () => {
      try {
        const response = await fetch("/api/summary");
        if (response.ok) {
          const latestSummaries = await response.json();
          console.log("latestSummaries", "bogos binted");
          setSummaries(latestSummaries as Summary[]);
        }
      } catch (error) {
        console.error("Error fetching latest summaries:", error);
      }
    };

    // const intervalId = setInterval(fetchLatestSummaries, 5000); // Fetch every 5 seconds

    // return () => clearInterval(intervalId);
  }, []);

  return { summaries, setSummaries };
}
