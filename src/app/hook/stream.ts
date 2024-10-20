import { useEffect } from "react";
import { IAgoraRTCClient } from "agora-rtc-react";
import { ITextstream, Parser } from "./utils";

// Assuming you have a parser instance
const parser = new Parser();

const useStreamSubscription = (client: IAgoraRTCClient | null) => {
  useEffect(() => {
    if (!client) return;

    const handleStreamMessage = (uid: string, data: Uint8Array) => {
      console.warn("fdsddf");
      parser.praseData(data);
    };

    // Subscribe to stream messages
    client.on("stream-message", handleStreamMessage);

    // Handle parsed data
    const handleTextStreamReceived = (textstream: ITextstream) => {
      console.warn("Received textstream:", textstream);
      // Here you can update your state or perform any other actions
      // with the received textstream data
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
