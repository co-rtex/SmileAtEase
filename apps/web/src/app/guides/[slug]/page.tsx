import Link from "next/link";
import { notFound } from "next/navigation";

import { DisclaimerBox } from "@/components/layout/DisclaimerBox";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getGuideBySlug, guides } from "@/lib/guides";

type GuidePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  return (
    <PageShell>
      <article className="py-12 md:py-16">
        <div className="grid gap-8">
          <div className="max-w-3xl space-y-4">
            <Link
              className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
              href="/guides"
            >
              Back to guides
            </Link>
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Procedure guide
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
              {guide.title}
            </h1>
            <p className="text-base leading-8 text-muted-foreground">
              {guide.summary}
            </p>
          </div>

          <DisclaimerBox />

          <div className="grid gap-5 md:grid-cols-2">
            <GuideSection
              accent="border-sky/60 bg-sky/15"
              items={guide.whatToExpect}
              title="What this visit may involve"
            />
            <GuideSection
              accent="border-yellow/70 bg-yellow/20"
              items={guide.commonWorries}
              title="Common worries"
            />
            <GuideSection
              accent="border-coral/55 bg-coral/10"
              items={guide.questionsToAsk}
              title="What you can ask"
            />
            <GuideSection
              accent="border-lavender/70 bg-lavender/20"
              items={guide.comfortTips}
              title="Comfort tips"
            />
          </div>

          <Card className="border-primary/20 bg-surface/95">
            <CardHeader>
              <CardTitle>Important reminder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {guide.reminder}
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/start">Create your visit plan</Button>
            <Button href="/guides" variant="secondary">
              Back to all guides
            </Button>
          </div>
        </div>
      </article>
    </PageShell>
  );
}

function GuideSection({
  accent,
  items,
  title,
}: {
  accent: string;
  items: readonly string[];
  title: string;
}) {
  return (
    <Card className={accent}>
      <CardHeader className="border-b border-border/50">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
