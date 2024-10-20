import { Notes } from "./notes";
import { Summary } from "./summary";
import { Summary as ISummary } from "~/lib/db/queries";

export const AIPanel = ({ summaries }: { summaries: ISummary[] }) => {
  return (
    <>
      <Summary />
      <Notes summaries={summaries} />
    </>
  );
};
