/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface TranscriptionState {
  isTranscribing: boolean;
  builderToken: string | null;
  taskId: string | null;
  startTranscription: (channelName: string) => Promise<void>;
  stopTranscription: () => Promise<void>;
}

export const useTranscriptionStore = create<TranscriptionState>((set, get) => ({
  isTranscribing: false,
  builderToken: null,
  taskId: null,
  startTranscription: async (channelName: string) => {
    try {
      const res = await fetch(`/api/transcribe/`, {
        method: "POST",
        body: JSON.stringify({ channel: channelName }),
      });
      if (!res.ok) throw new Error("Failed to start transcription");

      const data = await res.json();
      set({
        isTranscribing: true,
        builderToken: data.builderToken,
        taskId: data.taskId,
      });
    } catch (error: any) {
      console.error("Error starting transcription:", error.message);
    }
  },
  stopTranscription: async () => {
    const { taskId, builderToken } = get();
    if (!taskId || !builderToken) {
      console.error(
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

      set({ isTranscribing: false, builderToken: null, taskId: null });
    } catch (error: any) {
      console.error("Error stopping transcription:", error.message);
    }
  },
}));
