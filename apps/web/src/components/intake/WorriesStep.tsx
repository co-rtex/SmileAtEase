"use client";

import { useFormContext } from "react-hook-form";

import { worryOptions } from "@/lib/constants";
import type { IntakeInput } from "@/lib/intakeSchema";

import { CheckboxOptions, RadioOptions, StepFrame } from "./IntakeStep";

export function WorriesStep() {
  const {
    formState: { errors },
    watch,
  } = useFormContext<IntakeInput>();
  const selectedWorries = watch("worries") ?? [];
  const biggestWorryOptions = worryOptions.filter((option) =>
    selectedWorries.includes(option.value),
  );

  return (
    <StepFrame
      eyebrow="Main worries"
      title="Choose the parts of the visit that feel hardest."
      description="Select all that apply, then choose the one that feels most important to prepare for."
      requiredNote
    >
      <CheckboxOptions
        columns="three"
        error={errors.worries?.message}
        helperText="Choose at least one. You can select more than one."
        legend="What are your main worries?"
        name="worries"
        options={worryOptions}
        required
      />

      <RadioOptions
        columns="three"
        error={errors.biggest_worry?.message}
        emptyMessage="Select at least one worry above, then choose the one that feels biggest."
        helperText="This list is based on the worries you selected above."
        legend="Which one feels biggest right now?"
        name="biggest_worry"
        options={biggestWorryOptions}
        required
      />
    </StepFrame>
  );
}
