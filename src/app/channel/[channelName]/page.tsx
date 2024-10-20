import { Call } from "~/components/call-panel";
import { Sidebar } from "~/layouts/sidebar";
import { AGORA_APP_ID } from "~/lib/agora/const";
import {
  getSubtitles,
  getSummaries,
  getHeadlines,
  clearHeadlines,
} from "~/lib/db/queries";

interface PageProps {
  params: { channelName: string };
}

export default async function ChannelPage({ params }: PageProps) {
  const { channelName } = params;

  try {
    const [subtitles, summaries, headlines] = await Promise.all([
      getSubtitles(),
      getSummaries(),
      getHeadlines(),
    ]);

    return (
      <div className="flex gap-2 mx-6 mt-8 h-[calc(100vh-32px)]">
        <Call appId={AGORA_APP_ID} channelName={channelName} />
        <Sidebar
          initialSubtitles={subtitles}
          summaries={summaries.map((s) => s)}
          headlines={headlines}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading channel data. Please try again later.</div>;
  }
}
