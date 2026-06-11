"use client";

import { useFormContext } from "react-hook-form";

import {
  communicationPreferenceOptions,
  communicationStyleOptions,
} from "@/lib/constants";
import type { IntakeInput } from "@/lib/intakeSchema";

import { CheckboxOptions, RadioOptions, StepFrame } from "./IntakeStep";

export function CommunicationStep() {
  const {
    formState: { errors },
  } = useFormContext<IntakeInput>();

  return (
    <StepFrame
      eyebrow="Communication"
      title="Choose communication preferences that would help."
      description="These answers are for organizing your comfort card and review summary."
      requiredNote
    >
      <CheckboxOptions
        columns="two"
        error={errors.communication_preferences?.message}
        helperText="Choose at least one preference to include on your comfort card."
        legend="What communication preferences would you like to include?"
        name="communication_preferences"
        options={communicationPreferenceOptions}
        required
      />
      <RadioOptions
        error={errors.communication_style?.message}
        helperText="Choose the style that would feel easiest to receive."
        legend="What communication style feels best?"
        name="communication_style"
        options={communicationStyleOptions}
        required
      />
    </StepFrame>
  );
}
