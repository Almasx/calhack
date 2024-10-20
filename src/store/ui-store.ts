import { create } from "zustand";
import {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-react";

type UIState = {
  // Call-related state
  isMuted: boolean;
  isVideoOff: boolean;
  localAudioTrack: IMicrophoneAudioTrack | null;
  localVideoTrack: ICameraVideoTrack | null;
  remoteUsers: IAgoraRTCRemoteUser[];
  setLocalAudioTrack: (track: IMicrophoneAudioTrack | null) => void;
  setLocalVideoTrack: (track: ICameraVideoTrack | null) => void;
  setRemoteUsers: (users: IAgoraRTCRemoteUser[]) => void;
  toggleMute: () => void;
  toggleVideo: () => void;

  // Sidebar-related state
  isAIOpen: boolean;
  isTranscriptOpen: boolean;
  toggleAI: () => void;
  toggleTranscript: () => void;
};

export const useUIStore = create<UIState>((set, get) => ({
  // Call-related state and actions
  isMuted: false,
  isVideoOff: false,
  localAudioTrack: null,
  localVideoTrack: null,
  remoteUsers: [],
  setLocalAudioTrack: (track) => set({ localAudioTrack: track }),
  setLocalVideoTrack: (track) => set({ localVideoTrack: track }),
  setRemoteUsers: (users) => set({ remoteUsers: users }),
  toggleMute: () => {
    const { isMuted, localAudioTrack } = get();
    if (localAudioTrack) {
      localAudioTrack.setEnabled(isMuted);
      set({ isMuted: !isMuted });
    }
  },
  toggleVideo: () => {
    const { isVideoOff, localVideoTrack } = get();
    if (localVideoTrack) {
      localVideoTrack.setEnabled(isVideoOff);
      set({ isVideoOff: !isVideoOff });
    }
  },

  // Sidebar-related state and actions
  isAIOpen: false,
  isTranscriptOpen: false,
  toggleAI: () =>
    set((state) => ({ isAIOpen: !state.isAIOpen, isTranscriptOpen: false })),
  toggleTranscript: () =>
    set((state) => ({
      isTranscriptOpen: !state.isTranscriptOpen,
      isAIOpen: false,
    })),
}));
