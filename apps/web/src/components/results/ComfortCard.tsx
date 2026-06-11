import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BrandMark } from "@/components/brand/BrandMark";
import type { ComfortCard as ComfortCardType } from "@/lib/planSchema";

type ComfortCardProps = {
  comfortCard: ComfortCardType;
};

export function ComfortCard({ comfortCard }: ComfortCardProps) {
  return (
    <Card className="print-card border-primary/30 bg-gradient-to-br from-surface via-yellow/20 to-sky/20">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-primary/15">
        <CardTitle>Comfort Card</CardTitle>
        <BrandMark className="h-10 w-10" />
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-6 text-foreground">{comfortCard.intro}</p>
        <ComfortCardList items={comfortCard.my_concerns} title="My concerns" />
        <ComfortCardList items={comfortCard.what_helps_me} title="What helps me" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-primary/15 bg-surface/70 p-4">
            <h3 className="text-sm font-semibold text-foreground">
              Pause signal
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {comfortCard.pause_signal}
            </p>
          </div>
          <div className="rounded-lg border border-primary/15 bg-surface/70 p-4">
            <h3 className="text-sm font-semibold text-foreground">
              Communication preference
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {comfortCard.communication_preference}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ComfortCardList({
  items,
  title,
}: {
  items: string[];
  title: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {items.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Not provided.</p>
      )}
    </div>
  );
}
