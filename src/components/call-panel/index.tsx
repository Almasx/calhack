"use client";

import { useEffect } from "react";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import { ControlPanel } from "../control-panel";
import useStreamSubscription from "~/app/hook/stream";
import { useTranscriptionStore } from "~/store/transcription-store";
import { VideoGrid } from "./video-grid";

export const Call = ({
  appId,
  channelName,
}: {
  appId: string;
  channelName: string;
}) => {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );
  useStreamSubscription(client);

  const { startTranscription, stopTranscription, isTranscribing } =
    useTranscriptionStore();

  useEffect(() => {
    startTranscription(channelName);
    return () => {
      if (isTranscribing) {
        stopTranscription();
      }
    };
  }, [channelName, startTranscription, stopTranscription, isTranscribing]);

  return (
    <AgoraRTCProvider client={client}>
      <div className="grow flex flex-col gap-2 ">
        <VideoGrid appId={appId} channelName={channelName} />
        <ControlPanel />
      </div>
    </AgoraRTCProvider>
  );
};
