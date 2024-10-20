import { Notes } from "./notes";
import { Summary } from "./summary";
import { Headline, Summary as ISummary } from "~/lib/db/queries";

export const AIPanel = ({
  summaries,
  headlines,
}: {
  summaries: ISummary[];
  headlines: Headline[];
}) => {
  return (
    <>
      <Summary headlines={headlines} />
      <Notes summaries={summaries} />
    </>
  );
};
