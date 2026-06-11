import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import type { Plan } from "@/lib/planSchema";

import { ResultReminder } from "./ResultReminder";

type SafetyResultProps = {
  plan: Plan;
};

export function SafetyResult({ plan }: SafetyResultProps) {
  return (
    <section className="mx-auto w-full max-w-4xl py-10 md:py-14">
      <div className="print-section space-y-6 rounded-xl border border-border/70 bg-surface/90 p-5 shadow-panel sm:p-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
            SmileAtEase result
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
            {plan.title}
          </h1>
        </div>

        <Alert
          className={
            plan.safety_status === "crisis"
              ? "border-red-300 bg-red-50 text-red-900"
              : "border-amber-300 bg-amber-50 text-amber-900"
          }
        >
          {plan.blocked_or_redirect_message}
        </Alert>

        <p className="text-sm leading-6 text-muted-foreground">
          {plan.important_reminder}
        </p>

        <ResultReminder />

        <div className="print:hidden">
          <Button href="/start">Start Over</Button>
        </div>
      </div>
    </section>
  );
}
