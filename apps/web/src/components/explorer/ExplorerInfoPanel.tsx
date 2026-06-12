import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { ExplorerItem } from "@/lib/explorerSchema";

type ExplorerInfoPanelProps = {
  item: ExplorerItem | null;
};

const categoryLabels: Record<ExplorerItem["category"], string> = {
  comfort: "Comfort",
  equipment: "Equipment",
  protective: "Protective",
  tool: "Tool",
};

export function ExplorerInfoPanel({ item }: ExplorerInfoPanelProps) {
  if (!item) {
    return (
      <Card className="border-lavender/55 bg-surface/95">
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Learning card
          </p>
          <CardTitle>Pick a tool to learn about</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm leading-7 text-muted-foreground">
            Click a highlighted tool on the tray, or choose one from the list
            below. You will learn what it does, what you may notice, and one
            question you can ask the dental team.
          </p>
          <Button href="/start" variant="secondary">
            Create my visit plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-surface/95 shadow-panel lg:sticky lg:top-24">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-primary/20 bg-sky/15 px-3 py-1 text-xs font-semibold text-primary">
            {categoryLabels[item.category]}
          </span>
        </div>
        <CardTitle>{item.title}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          {item.quickSummary}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <InfoSection title="What it does" value={item.whatItDoes} />
        <InfoSection title="What you may notice" value={item.whatYouMayNotice} />
        <InfoSection title="Why it helps" value={item.whyItHelps} />
        <section>
          <h3 className="text-sm font-semibold text-foreground">
            How to feel more prepared
          </h3>
          <ul className="mt-3 space-y-2">
            {item.howToFeelMorePrepared.map((tip) => (
              <li className="flex gap-2 text-sm leading-6 text-muted-foreground" key={tip}>
                <span
                  aria-hidden="true"
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-coral/35 bg-coral/10 p-4">
          <h3 className="text-sm font-semibold text-foreground">
            A question you can ask
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {item.questionToAsk}
          </p>
        </section>
        {item.gentleReminder ? (
          <p className="rounded-md border border-border/70 bg-surface-soft/70 px-3 py-2 text-xs font-medium text-muted-foreground">
            {item.gentleReminder}
          </p>
        ) : null}
        <div className="border-t border-border/70 pt-5">
          <Button href="/start">Create my visit plan</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoSection({ title, value }: { title: string; value: string }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{value}</p>
    </section>
  );
}
