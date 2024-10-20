"use client";
import React, { useCallback, useMemo } from "react";
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  Phone,
} from "lucide-react";
import { useUIStore } from "../../store/ui-store";
import { ActionButton } from "./action-button";
import { useRouter } from "next/navigation";

interface ControlAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "active" | "danger";
}

const AIIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5"
  >
    <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
    <path d="M12 12 2.1 9.1a10 10 0 0 0 19.8 0L12 12Z" />
    <path d="M12 12v10" />
  </svg>
);

const TranscriptIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5"
  >
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
    <path d="M9 9h1" />
    <path d="M9 13h6" />
    <path d="M9 17h6" />
  </svg>
);

export const ControlPanel: React.FC = () => {
  const {
    isAIOpen,
    isTranscriptOpen,
    toggleAI,
    toggleTranscript,
    isMuted,
    isVideoOff,
    toggleMute,
    toggleVideo,
  } = useUIStore();
  const router = useRouter();

  const handleLeaveCall = useCallback(() => {
    router.push("/");
  }, [router]);

  const audioAction = useMemo(
    (): ControlAction => ({
      label: isMuted ? "Unmute" : "Mute",
      icon: isMuted ? (
        <MicOffIcon className="size-5" />
      ) : (
        <MicIcon className="size-5" />
      ),
      onClick: toggleMute,
      variant: isMuted ? "active" : "default",
    }),
    [isMuted, toggleMute]
  );

  const videoAction = useMemo(
    (): ControlAction => ({
      label: isVideoOff ? "Turn on camera" : "Turn off camera",
      icon: isVideoOff ? (
        <VideoOffIcon className="size-5" />
      ) : (
        <VideoIcon className="size-5" />
      ),
      onClick: toggleVideo,
      variant: isVideoOff ? "active" : "default",
    }),
    [isVideoOff, toggleVideo]
  );

  const leaveCallAction = useMemo(
    (): ControlAction => ({
      label: "Leave call",
      icon: <Phone className="size-5" />,
      onClick: handleLeaveCall,
      variant: "danger",
    }),
    [handleLeaveCall]
  );

  const aiAction = useMemo(
    (): ControlAction => ({
      label: "AI",
      icon: <AIIcon />,
      onClick: toggleAI,
      variant: isAIOpen ? "active" : "default",
    }),
    [isAIOpen, toggleAI]
  );

  const transcriptAction = useMemo(
    (): ControlAction => ({
      label: "Transcript",
      icon: <TranscriptIcon />,
      onClick: toggleTranscript,
      variant: isTranscriptOpen ? "active" : "default",
    }),
    [isTranscriptOpen, toggleTranscript]
  );

  const controlActions = useMemo(
    () => [
      audioAction,
      videoAction,
      leaveCallAction,
      aiAction,
      transcriptAction,
    ],
    [audioAction, videoAction, leaveCallAction, aiAction, transcriptAction]
  );

  return (
    <div className="h-16 flex gap-3 items-center justify-center ">
      {controlActions.map((action) => (
        <ActionButton key={action.label} {...action} />
      ))}
    </div>
  );
};
