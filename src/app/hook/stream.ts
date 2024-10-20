import { useEffect } from "react";
import { IAgoraRTCClient } from "agora-rtc-react";
import { ITextstream, Parser } from "./utils";
import { useSubtitlesStore } from "~/store/subtitle-store";

// Assuming you have a parser instance
const parser = new Parser();

const useStreamSubscription = (client: IAgoraRTCClient | null) => {
  const updateSubtitles = useSubtitlesStore((state) => state.updateSubtitles);

  useEffect(() => {
    if (!client) return;

    console.warn("client", client);

    const handleStreamMessage = (uid: string, data: Uint8Array) => {
      parser.praseData(data);
    };

    // Subscribe to stream messages
    client.on("stream-message", handleStreamMessage);
    client.on("exception", () => {
      console.warn("something");
    });

    const handleTextStreamReceived = (textstream: ITextstream) => {
      console.warn("Received textstream:", textstream);
      const username = `User ${textstream.uid}`;
      updateSubtitles(textstream, username);
    };

    parser.on("textstreamReceived", handleTextStreamReceived);

    // Cleanup function
    return () => {
      client.off("stream-message", handleStreamMessage);
      parser.off("textstreamReceived", handleTextStreamReceived);
    };
  }, [client]); // Re-run effect if client changes
};

export default useStreamSubscription;
