"use client";

import { useFormContext } from "react-hook-form";

import {
  badExperienceLevelOptions,
  includeBadExperienceNoteOptions,
  lastVisitOptions,
} from "@/lib/constants";
import type { IntakeInput } from "@/lib/intakeSchema";
import { cn } from "@/lib/utils";

import { FieldError, RadioOptions, StepFrame } from "./IntakeStep";

export function HistoryStep() {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<IntakeInput>();
  const currentNoteChoice = watch("include_bad_experience_note");

  return (
    <StepFrame
      eyebrow="Visit history"
      title="Share a little about past visits."
      description="You can keep prior experiences private or choose how they should be reflected in the review."
      requiredNote
    >
      <RadioOptions
        error={errors.last_visit?.message}
        helperText="Choose the closest answer."
        legend="When was your last dental visit?"
        name="last_visit"
        options={lastVisitOptions}
        required
      />
      <RadioOptions
        error={errors.bad_experience_level?.message}
        helperText="Choose what fits best, or choose “Prefer not to say.”"
        legend="Have past visits been upsetting?"
        name="bad_experience_level"
        options={badExperienceLevelOptions}
        required
      />

      <fieldset className="space-y-3">
        <legend className="flex flex-wrap items-center gap-2 text-base font-semibold text-foreground">
          <span>Should the review mention a past difficult experience?</span>
          <span className="rounded-full border border-border bg-surface-soft px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            Optional
          </span>
        </legend>
        <p className="text-sm leading-6 text-muted-foreground">
          You can skip this or choose how much to include.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            className={cn(
              "rounded-lg border border-border bg-surface p-4 text-left text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-surface-soft",
              currentNoteChoice === null &&
                "border-primary bg-surface-soft ring-1 ring-primary",
            )}
            onClick={() =>
              setValue("include_bad_experience_note", null, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            type="button"
          >
            Skip this for now
          </button>
          {includeBadExperienceNoteOptions.map((option) => (
            <button
              className={cn(
                "rounded-lg border border-border bg-surface p-4 text-left text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-surface-soft",
                currentNoteChoice === option.value &&
                  "border-primary bg-surface-soft ring-1 ring-primary",
              )}
              key={option.value}
              onClick={() =>
                setValue("include_bad_experience_note", option.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <FieldError message={errors.include_bad_experience_note?.message} />
      </fieldset>
    </StepFrame>
  );
}
