"use client";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Summary } from "~/components/ai-panel/summary";
import { Headline } from "~/lib/db/queries";

const PRODUCT_DEMO_HEADLINES: Headline[] = [
  {
    _id: "1",
    text: "The next big thing in Real Time AI is here",
    timestamp: new Date(),
  },
  {
    _id: "2",
    text: "AI is changing the game",
    timestamp: new Date(),
  },
  {
    _id: "3",
    text: "AI is the future",
    timestamp: new Date(),
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center h-screen w-96 mx-auto justify-center">
      <Summary
        headlines={PRODUCT_DEMO_HEADLINES}
        className="mb-8 w-64 scale-[1.5] origin-bottom"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            channel: { value: string };
          };
          router.push(`/channel/${target.channel.value}`);
        }}
        className="flex flex-col mt-6 w-full"
      >
        <label className="block text-neutral-500 mb-1 ">Channel Name</label>
        <div className="flex gap-3 grow">
          <input
            className="bg-neutral-900 placeholder:text-neutral-500 grow border border-neutral-800 rounded-xl px-3 h-11 shadow-[inset_0_0_20px_rgba(36,36,36,0.5)] focus:outline-none focus:border-neutral-700"
            id="inline-full-name"
            type="text"
            name="channel"
            placeholder="Enter channel name"
            required
          />
          <button
            type="submit"
            className="flex size-11 aspect-square items-center justify-center text-[#00FFE1]  bg-[#0A453E] hover:bg-[#0E5850] duration-150 ease-out rounded-xl shadow-[0_0_10px_rgba(68,239,219,0.3)_inset]"
          >
            <ChevronRight />
          </button>
        </div>
      </form>
    </div>
  );
}
