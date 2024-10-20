import Call from "~/components/call";
import SubtitlesDisplay from "~/components/transcript";
import { AGORA_APP_ID } from "~/lib/agora/const";

export default function Page({ params }: { params: { channelName: string } }) {
  return (
    <div className="flex w-full flex-col">
      <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
        {params.channelName!}
      </p>
        <div className="flex w-full h-full">
            <SubtitlesDisplay />
            <Call appId={AGORA_APP_ID} channelName={params.channelName}></Call>
        </div>
      
    </div>
  );
}
