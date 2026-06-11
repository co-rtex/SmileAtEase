import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { GetPlanResponse, Plan } from "@/lib/planSchema";

import { ComfortCard } from "./ComfortCard";
import { CopyButton } from "./CopyButton";
import { PrintButton } from "./PrintButton";
import { ResultReminder } from "./ResultReminder";
import { SafetyResult } from "./SafetyResult";

type PlanRendererProps = {
  response: GetPlanResponse;
};

export function PlanRenderer({ response }: PlanRendererProps) {
  const plan = response.plan;

  if (
    plan.safety_status === "urgent_dental_or_medical" ||
    plan.safety_status === "crisis"
  ) {
    return <SafetyResult plan={plan} />;
  }

  return (
    <section className="mx-auto w-full max-w-5xl py-10 md:py-14">
      <article className="print-section space-y-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
              SmileAtEase result
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
              {plan.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
              {plan.gentle_summary}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 print:hidden">
            <CopyButton getText={() => formatPlanText(plan)} label="Copy Plan" />
            <CopyButton
              getText={() => formatComfortCardText(plan)}
              label="Copy Comfort Card"
            />
            <PrintButton />
          </div>
        </div>

        {plan.safety_status === "boundary" ? (
          <Alert className="border-amber-300 bg-amber-50 text-amber-900">
            {plan.blocked_or_redirect_message ?? plan.important_reminder}
          </Alert>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <PlanSection items={plan.main_concerns} title="Main Concerns" />
          <PlanSection items={plan.before_visit} title="Before Visit" />
          <PlanSection items={plan.when_you_arrive} title="When You Arrive" />
          <PlanSection items={plan.during_visit} title="During Visit" />
          <PlanSection items={plan.if_overwhelmed} title="If Overwhelmed" />
          <PlanSection items={plan.questions_to_ask} title="Questions To Ask" />
        </div>

        <ComfortCard comfortCard={plan.comfort_card} />

        <Card className="print-section border-yellow/70 bg-yellow/20">
          <CardContent className="p-5">
            <p className="text-sm leading-6 text-foreground">
              {plan.important_reminder}
            </p>
          </CardContent>
        </Card>

        <ResultReminder />

        <div className="print:hidden">
          <Button href="/start">Start Over</Button>
        </div>
      </article>
    </section>
  );
}

function PlanSection({ items, title }: { items: string[]; title: string }) {
  return (
    <Card className="print-section border-primary/10 bg-surface/95">
      <CardHeader className="border-b border-border/60">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Not provided.</p>
        )}
      </CardContent>
    </Card>
  );
}

function formatPlanText(plan: Plan) {
  const sections: Array<[string, string[]]> = [
    [plan.title, [plan.gentle_summary]],
    ["Main Concerns", plan.main_concerns],
    ["Before Visit", plan.before_visit],
    ["When You Arrive", plan.when_you_arrive],
    ["During Visit", plan.during_visit],
    ["If Overwhelmed", plan.if_overwhelmed],
    ["Questions To Ask", plan.questions_to_ask],
    ["Comfort Card", formatComfortCardLines(plan)],
    ["Important Reminder", [plan.important_reminder]],
    [
      "SmileAtEase Reminder",
      [
        "SmileAtEase is an educational preparation tool. It does not diagnose, treat, or replace professional care. For urgent symptoms or immediate safety concerns, contact a qualified professional or emergency service.",
      ],
    ],
  ];

  return sections
    .map(([title, items]) => formatTextSection(title, items))
    .join("\n\n");
}

function formatComfortCardText(plan: Plan) {
  return formatTextSection("Comfort Card", formatComfortCardLines(plan));
}

function formatComfortCardLines(plan: Plan) {
  return [
    plan.comfort_card.intro,
    "My concerns:",
    ...plan.comfort_card.my_concerns.map((item) => `- ${item}`),
    "What helps me:",
    ...plan.comfort_card.what_helps_me.map((item) => `- ${item}`),
    `Pause signal: ${plan.comfort_card.pause_signal}`,
    `Communication preference: ${plan.comfort_card.communication_preference}`,
  ].filter(Boolean);
}

function formatTextSection(title: string, items: string[]) {
  const lines = items.length > 0 ? items : ["Not provided."];

  return [title, ...lines.map((item) => `- ${item}`)].join("\n");
}
