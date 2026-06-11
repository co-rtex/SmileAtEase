import { PageShell } from "@/components/layout/PageShell";
import { ResultLoader } from "@/components/results/ResultLoader";

type ResultPageProps = {
  params: {
    planId: string;
  };
};

export default function ResultPage({ params }: ResultPageProps) {
  return (
    <PageShell>
      <ResultLoader planId={params.planId} />
    </PageShell>
  );
}
