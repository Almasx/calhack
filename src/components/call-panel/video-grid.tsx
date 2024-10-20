import {
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  useRemoteUsers,
  useRemoteAudioTracks,
  usePublish,
  useJoin,
  LocalVideoTrack,
  RemoteUser,
} from "agora-rtc-react";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useUIStore } from "~/store/ui-store";
import { DefaultVideoView } from "./default-video";
import { AGORA_APP_TOKEN } from "~/lib/agora/const";

export const VideoGrid = ({
  appId,
  channelName,
}: {
  appId: string;
  channelName: string;
}) => {
  const { setLocalAudioTrack, setLocalVideoTrack, setRemoteUsers, isVideoOff } =
    useUIStore();
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsersRaw = useRemoteUsers();
  const remoteUsers = useMemo(
    () => remoteUsersRaw.filter((user) => user.uid !== 2000),
    [remoteUsersRaw]
  );
  console.log(remoteUsersRaw);

  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  usePublish([localMicrophoneTrack, localCameraTrack]);

  useJoin({
    appid: appId,
    channel: channelName,
    token: AGORA_APP_TOKEN,
  });

  useEffect(() => {
    setLocalAudioTrack(localMicrophoneTrack);
    setLocalVideoTrack(localCameraTrack);
    setRemoteUsers(remoteUsers);
  }, [
    localMicrophoneTrack,
    localCameraTrack,
    remoteUsers,
    setLocalAudioTrack,
    setLocalVideoTrack,
    setRemoteUsers,
  ]);

  audioTracks.map((track) => track.play());

  if (isLoadingMic || isLoadingCam) {
    return (
      <div className="flex flex-col items-center grow justify-center ">
        Loading devices...
      </div>
    );
  }

  const totalParticipants = remoteUsers.length + 1; // +1 for local user

  const getGridClassName = () => {
    if (totalParticipants <= 1) return "grid-cols-1";
    if (totalParticipants <= 4) return "grid-cols-2";
    if (totalParticipants <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  return (
    <motion.div
      className={`grid gap-2 grow ${getGridClassName()}`}
      layout
      transition={{ duration: 0.5, type: "spring", bounce: 0 }}
    >
      <motion.div layout className="w-full h-full">
        {localCameraTrack && !isVideoOff ? (
          <LocalVideoTrack
            track={localCameraTrack}
            play={true}
            className="bg-neutral-900 rounded-xl overflow-hidden text-4xl text-neutral-500 grid place-items-center aspect-video w-full h-full object-cover"
          />
        ) : (
          <DefaultVideoView username={"You"} />
        )}
      </motion.div>
      {remoteUsers.map((user) => (
        <motion.div
          key={user.uid}
          layout
          className="w-full h-full relative bg-neutral-900 rounded-xl"
        >
          <RemoteUser
            user={user}
            className="bg-neutral-900 overflow-hidden rounded-xl text-4xl text-neutral-500 grid place-items-center aspect-video w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-neutral-900 px-2 py-1 rounded text-sm text-white">
            User {user.uid}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
