"use client";

import { useFormContext } from "react-hook-form";

import type { IntakeInput } from "@/lib/intakeSchema";

import { FieldError, StepFrame } from "./IntakeStep";

export function OptionalDetailsStep() {
  const {
    formState: { errors },
    register,
    watch,
  } = useFormContext<IntakeInput>();
  const optionalContext = watch("optional_context") ?? "";

  return (
    <StepFrame
      eyebrow="Optional details"
      title="Add anything else you want reflected in the review."
      description="This is optional. Keep it brief and focused on visit preparation or communication preferences."
    >
      <div className="space-y-3">
        <label
          className="flex flex-wrap items-center gap-2 text-base font-semibold text-foreground"
          htmlFor="optional_context"
        >
          <span>Optional context</span>
          <span className="rounded-full border border-border bg-surface-soft px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            Optional
          </span>
        </label>
        <p className="text-sm leading-6 text-muted-foreground">
          Add a short note only if there is something you want reflected in the
          plan.
        </p>
        <textarea
          className="min-h-40 w-full rounded-lg border border-border bg-surface p-4 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          id="optional_context"
          maxLength={700}
          placeholder="Example: I prefer simple explanations and short breaks."
          {...register("optional_context")}
        />
        <div className="flex items-center justify-between gap-4">
          <FieldError message={errors.optional_context?.message} />
          <p className="ml-auto text-sm text-muted-foreground">
            {optionalContext.length} / 700
          </p>
        </div>
      </div>
    </StepFrame>
  );
}
