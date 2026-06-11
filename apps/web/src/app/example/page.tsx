import { DisclaimerBox } from "@/components/layout/DisclaimerBox";
import { PageShell } from "@/components/layout/PageShell";
import { IconBadge } from "@/components/marketing/IconBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const exampleSections = [
  {
    title: "Before Visit",
    items: [
      "Write down your top questions before the appointment.",
      "Tell the office that dental visits can make you nervous.",
      "Choose a pause signal before the visit begins.",
    ],
  },
  {
    title: "During Visit",
    items: [
      "Ask for each step to be explained before it starts.",
      "Use your pause signal if you need a short break.",
      "Tell the dental team if something hurts or feels overwhelming.",
    ],
  },
  {
    title: "Questions To Ask",
    items: [
      "What will happen during today's visit?",
      "Can we agree on a pause signal before we begin?",
      "Can you explain costs before doing anything additional?",
    ],
  },
];

export default function ExamplePage() {
  return (
    <PageShell>
      <section className="py-12 md:py-16">
        <div className="grid gap-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Example
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
              Example visit preparation plan
            </h1>
            <p className="text-base leading-8 text-muted-foreground">
              This sample shows the kind of communication-focused plan
              SmileAtEase can create. Your own plan will reflect your structured
              intake answers.
            </p>
            <Button href="/start">Create your visit plan</Button>
          </div>

          <DisclaimerBox />

          <div className="grid gap-4 md:grid-cols-3">
            {exampleSections.map((section, index) => (
              <Card
                className={[
                  "border-sky/60 bg-sky/15",
                  "border-yellow/70 bg-yellow/20",
                  "border-coral/55 bg-coral/10",
                ][index]}
                key={section.title}
              >
                <CardHeader>
                  <IconBadge
                    icon={index === 0 ? "checklist" : index === 1 ? "card" : "chat"}
                  />
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-primary/25 bg-gradient-to-br from-surface via-yellow/20 to-sky/20">
            <CardHeader className="border-b border-primary/15">
              <CardTitle>Comfort Card Preview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  My concerns
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Feeling overwhelmed, wanting clear communication, and needing
                  a way to pause.
                </p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  What helps me
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Please explain each step, check in during the visit, and pause
                  if I raise my hand.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
