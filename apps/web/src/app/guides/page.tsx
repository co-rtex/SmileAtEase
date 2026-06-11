import Link from "next/link";

import { DisclaimerBox } from "@/components/layout/DisclaimerBox";
import { PageShell } from "@/components/layout/PageShell";
import { IconBadge } from "@/components/marketing/IconBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { guides } from "@/lib/guides";

const guideAccents = [
  {
    border: "border-sky/50",
    line: "bg-sky",
    wash: "bg-sky/10",
    icon: "border-sky/50 bg-sky/20 text-primary",
  },
  {
    border: "border-yellow/60",
    line: "bg-yellow",
    wash: "bg-yellow/20",
    icon: "border-yellow/70 bg-yellow/25 text-foreground",
  },
  {
    border: "border-coral/50",
    line: "bg-coral",
    wash: "bg-coral/10",
    icon: "border-coral/50 bg-coral/20 text-foreground",
  },
  {
    border: "border-lavender/60",
    line: "bg-lavender",
    wash: "bg-lavender/20",
    icon: "border-lavender/60 bg-lavender/25 text-foreground",
  },
  {
    border: "border-primary/25",
    line: "bg-primary",
    wash: "bg-primary/10",
    icon: "border-primary/25 bg-primary/10 text-primary",
  },
  {
    border: "border-sky/50",
    line: "bg-sky",
    wash: "bg-sky/10",
    icon: "border-sky/50 bg-sky/20 text-primary",
  },
];
const guideIcons = ["sparkle", "book", "card", "chat", "question", "shield"] as const;

export default function GuidesPage() {
  return (
    <PageShell>
      <section className="py-12 md:py-16">
        <div className="grid gap-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Procedure guides
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
              Prepare for common dental visit conversations.
            </h1>
            <p className="text-base leading-8 text-muted-foreground">
              These short guides help you think through what may happen, what
              people commonly worry about, and what you can ask the dental team.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/start">Create your visit plan</Button>
              <Button href="/example" variant="secondary">
                View example plan
              </Button>
            </div>
          </div>

          <DisclaimerBox />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide, index) => (
              <Card
                className={`group relative flex flex-col overflow-hidden bg-surface/95 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-panel ${guideAccents[index % guideAccents.length].border}`}
                key={guide.slug}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${guideAccents[index % guideAccents.length].line}`}
                />
                <div
                  className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${guideAccents[index % guideAccents.length].wash}`}
                />
                <CardHeader className="relative p-5 pb-2">
                  <IconBadge
                    className={`mb-1 shadow-sm ${guideAccents[index % guideAccents.length].icon}`}
                    icon={guideIcons[index % guideIcons.length]}
                  />
                  <CardTitle>{guide.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative flex flex-1 flex-col gap-5 p-5 pt-2">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {guide.summary}
                  </p>
                  <Link
                    className="mt-auto text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
                    href={`/guides/${guide.slug}`}
                  >
                    Read guide
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
