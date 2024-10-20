import { useEffect } from "react";
import { IAgoraRTCClient } from "agora-rtc-react";
import { ITextstream, Parser } from "./utils";
import { useSubtitlesStore } from "~/lib/store";

// Assuming you have a parser instance
const parser = new Parser();

const useStreamSubscription = (client: IAgoraRTCClient | null) => {
  const addSubtitle = useSubtitlesStore((state) => state.addSubtitle);

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

    // Handle parsed data
    const handleTextStreamReceived = (textstream: ITextstream) => {
      console.warn("Received textstream:", textstream);
      // Here you can update your state or perform any other actions
      // with the received textstream data
      const username = `User ${textstream.uid}`;
      addSubtitle(textstream, username);
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
