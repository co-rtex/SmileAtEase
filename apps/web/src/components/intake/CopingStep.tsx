"use client";

import { useFormContext } from "react-hook-form";

import { copingPreferenceOptions } from "@/lib/constants";
import type { IntakeInput } from "@/lib/intakeSchema";

import { CheckboxOptions, StepFrame } from "./IntakeStep";

export function CopingStep() {
  const { register } = useFormContext<IntakeInput>();

  return (
    <StepFrame
      eyebrow="Comfort tools"
      title="Choose simple tools you may want to bring with you."
      description="This section is optional. Choose anything that feels useful for your preparation plan."
    >
      <CheckboxOptions
        columns="three"
        helperText="Optional. Choose any that you want reflected in your plan."
        legend="Which comfort tools would you like to include?"
        name="coping_preferences"
        options={copingPreferenceOptions}
      />

      <label className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm font-medium text-foreground">
        <input
          className="mt-0.5 h-4 w-4 accent-primary"
          type="checkbox"
          {...register("include_calming_script")}
        />
        <span>
          Include a short grounding script in the review.
          <span className="ml-2 rounded-full border border-border bg-surface-soft px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            Optional
          </span>
        </span>
      </label>
    </StepFrame>
  );
}
