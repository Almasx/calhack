// src/components/default-video-view.tsx
import React from "react";

interface DefaultVideoViewProps {
  username: string;
}

export const DefaultVideoView: React.FC<DefaultVideoViewProps> = ({
  username,
}) => {
  const initials = username
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-full h-full flex items-center justify-center bg-neutral-800 rounded-lg">
      <div className="w-20 h-20 rounded-full bg-neutral-600 flex items-center justify-center text-2xl font-semibold text-white">
        {initials}
      </div>
    </div>
  );
};
