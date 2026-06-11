"use client";

import { useFormContext } from "react-hook-form";

import {
  appointmentStatusOptions,
  planForOptions,
  visitTypeOptions,
} from "@/lib/constants";
import type { IntakeInput } from "@/lib/intakeSchema";

import { RadioOptions, StepFrame } from "./IntakeStep";

export function AppointmentStep() {
  const {
    formState: { errors },
  } = useFormContext<IntakeInput>();

  return (
    <StepFrame
      eyebrow="Appointment context"
      title="Tell us what kind of visit you are preparing for."
      description="These answers help organize the plan around timing, visit type, and who the plan is for."
      requiredNote
    >
      <RadioOptions
        error={errors.appointment_status?.message}
        helperText="Choose the closest answer. It is okay if the visit is not scheduled yet."
        legend="When is the visit?"
        name="appointment_status"
        options={appointmentStatusOptions}
        required
      />
      <RadioOptions
        columns="three"
        error={errors.visit_type?.message}
        helperText="Pick the closest match. If you are unsure, choose “Not sure.”"
        legend="What kind of visit is it?"
        name="visit_type"
        options={visitTypeOptions}
        required
      />
      <RadioOptions
        error={errors.plan_for?.message}
        helperText="This helps phrase the plan in the right way."
        legend="Who is this plan for?"
        name="plan_for"
        options={planForOptions}
        required
      />
    </StepFrame>
  );
}
