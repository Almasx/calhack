"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import Link from "next/link";
import { useState } from "react";

function Call(props: { appId: string; channelName: string }) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );
  const [builderToken, setBuilderToken] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleStartTranscription = async () => {
    try {
      const res = await fetch(`/api/transcribe/`, {
        method: "POST",
        body: JSON.stringify({ channel: props.channelName }),
      });
      if (!res.ok) throw new Error("Failed to start transcription");

      const data = await res.json();
      setBuilderToken(data.builderToken);
      setTaskId(data.taskId);
      console.warn(`Transcription started! Task ID: ${data.taskId}`);
      setMessage(`Transcription started! Task ID: ${data.taskId}`);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleStopTranscription = async () => {
    if (!taskId || !builderToken) {
      setMessage(
        "Task ID and Builder Token are required to stop transcription."
      );
      return;
    }

    try {
      const res = await fetch(`/api/transcribe`, {
        method: "DELETE",
        body: JSON.stringify({ taskId, builderToken }),
      });
      if (!res.ok) throw new Error("Failed to stop transcription");

      const data = await res.json();
      setMessage(`Transcription stopped! Response: ${JSON.stringify(data)}`);
      setTaskId(null);
      setBuilderToken(null);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={props.channelName} AppID={props.appId} />
      <div className="fixed z-10 gap-3 bottom-0 left-0 right-0 flex justify-center pb-4">
        <Link
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          href="/"
        >
          End Call
        </Link>

        <button
          onClick={handleStartTranscription}
          className="px-5 py-3 text-base font-medium text-center text-white bg-blue-400 rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
        >
          Start Transcribing
        </button>

        <button
          onClick={handleStopTranscription}
          className="px-5 py-3 text-base font-medium text-center text-white bg-green-400 rounded-lg hover:bg-green-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
        >
          Stop Transcribing
        </button>
      </div>

      {message && (
        <div className="fixed bottom-20 text-center text-white">
          <strong>{message}</strong>
        </div>
      )}
      {message && (
        <div className="fixed bottom-20 text-center text-white">
          <strong>{message}</strong>
        </div>
      )}
    </AgoraRTCProvider>
  );
}

function Videos(props: { channelName: string; AppID: string }) {
  const { AppID, channelName } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  usePublish([localMicrophoneTrack, localCameraTrack]);

  useJoin({
    appid: AppID,
    channel: channelName,
    token:
      "007eJxTYLCb5m575LKwZ0ud6YUdc08s3Lxt28uJxQ+PiWzrnZ747NhcBYYU02RLyxTL1OQkIwuT5BQDC4O0ZINE02QjizRLU7PktDwmkfSGQEYGsUW5rIwMEAjiszIk5uQmFjMwAAAxkyHN",
  });

  audioTracks.map((track) => track.play());
  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading)
    return (
      <div className="flex flex-col items-center pt-40">Loading devices...</div>
    );

  const unit = "minmax(0, 1fr) ";

  return (
    <div className="flex flex-col justify-between w-full h-screen p-1">
      <div
        className={`grid gap-1 flex-1`}
        style={{
          gridTemplateColumns:
            remoteUsers.length > 9
              ? unit.repeat(4)
              : remoteUsers.length > 4
              ? unit.repeat(3)
              : remoteUsers.length > 1
              ? unit.repeat(2)
              : unit,
        }}
      >
        <LocalVideoTrack
          track={localCameraTrack}
          play={true}
          className="w-full h-full"
        />
        {remoteUsers.map((user) => (
          <RemoteUser user={user} key={user.uid} />
        ))}
      </div>
    </div>
  );
}

export default Call;
