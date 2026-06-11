"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FieldPath, UseFormReturn } from "react-hook-form";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import {
  appointmentStatusOptions,
  badExperienceLevelOptions,
  communicationPreferenceOptions,
  communicationStyleOptions,
  copingPreferenceOptions,
  getOptionLabel,
  getOptionLabels,
  includeBadExperienceNoteOptions,
  lastVisitOptions,
  planForOptions,
  visitTypeOptions,
  worryOptions,
} from "@/lib/constants";
import { generatePlan } from "@/lib/api";
import { intakeSchema, type IntakeInput } from "@/lib/intakeSchema";

import { AppointmentStep } from "./AppointmentStep";
import { CommunicationStep } from "./CommunicationStep";
import { CopingStep } from "./CopingStep";
import { FieldError, StepFrame } from "./IntakeStep";
import { HistoryStep } from "./HistoryStep";
import { OptionalDetailsStep } from "./OptionalDetailsStep";
import { WorriesStep } from "./WorriesStep";

type IntakeStepConfig = {
  id: string;
  label: string;
  fields: FieldPath<IntakeInput>[];
};

const steps: IntakeStepConfig[] = [
  {
    id: "disclaimer",
    label: "Welcome",
    fields: ["disclaimer_acknowledged"],
  },
  {
    id: "appointment",
    label: "Visit details",
    fields: ["appointment_status", "visit_type", "plan_for"],
  },
  {
    id: "worries",
    label: "Worries",
    fields: ["worries", "biggest_worry"],
  },
  {
    id: "history",
    label: "Past visits",
    fields: [
      "last_visit",
      "bad_experience_level",
      "include_bad_experience_note",
    ],
  },
  {
    id: "communication",
    label: "Communication",
    fields: ["communication_preferences", "communication_style"],
  },
  {
    id: "coping",
    label: "Comfort tools",
    fields: ["coping_preferences", "include_calming_script"],
  },
  {
    id: "details",
    label: "Optional details",
    fields: ["optional_context"],
  },
  {
    id: "review",
    label: "Review",
    fields: [],
  },
];

const defaultValues: Partial<IntakeInput> = {
  worries: [],
  communication_preferences: [],
  coping_preferences: [],
  urgent_symptoms: ["none" as const],
  self_harm_risk: "no",
  include_bad_experience_note: null,
  include_calming_script: true,
  optional_context: "",
  disclaimer_acknowledged: false,
};

export function IntakeFlow() {
  const router = useRouter();
  const form = useForm<IntakeInput>({
    defaultValues,
    mode: "onTouched",
    resolver: zodResolver(intakeSchema),
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentStep = steps[stepIndex];
  const progressValue = ((stepIndex + 1) / steps.length) * 100;

  async function goNext() {
    const isValid =
      currentStep.fields.length === 0
        ? await form.trigger(undefined, { shouldFocus: true })
        : await form.trigger(currentStep.fields, { shouldFocus: true });

    if (!isValid) {
      setStepError(
        "Please complete the required section marked below, then continue.",
      );
      return;
    }

    setStepError(null);
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setStepError(null);
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  async function submitForPlan() {
    setSubmitError(null);
    setStepError(null);
    const isValid = await form.trigger(undefined, { shouldFocus: true });

    if (!isValid) {
      setStepError(
        "Please review the required answers before generating your plan.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await generatePlan(form.getValues());
      router.push(`/result/${response.plan_id}`);
    } catch {
      setSubmitError(
        "We could not generate your plan right now. Please check your connection and try again.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form
        className="mx-auto w-full max-w-5xl py-10 md:py-14"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="mb-8 rounded-xl border border-border/70 bg-surface/80 p-4 shadow-soft">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Step {stepIndex + 1} of {steps.length}: {currentStep.label}
            </span>
            <span>Required sections are clearly marked</span>
          </div>
          <Progress value={progressValue} />
        </div>

        <Card className="border-primary/15 bg-surface/95 shadow-panel">
          <CardContent className="p-5 sm:p-8">
            {renderCurrentStep(currentStep.id, form)}
          </CardContent>
        </Card>
        {stepError ? (
          <Alert className="mt-4 border-coral/50 bg-coral/10 text-red-900">
            {stepError}
          </Alert>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            disabled={stepIndex === 0 || isSubmitting}
            onClick={goBack}
            type="button"
            variant="secondary"
          >
            Back
          </Button>
          {currentStep.id === "review" ? (
            <Button
              disabled={isSubmitting}
              onClick={submitForPlan}
              type="button"
            >
              {isSubmitting ? "Generating..." : "Generate My Visit Plan"}
            </Button>
          ) : (
            <Button disabled={isSubmitting} onClick={goNext} type="button">
              Next
            </Button>
          )}
        </div>
        {submitError ? (
          <Alert className="mt-4 border-red-300 bg-red-50 text-red-900">
            {submitError}
          </Alert>
        ) : null}
      </form>
    </FormProvider>
  );
}

function renderCurrentStep(
  stepId: string,
  form: UseFormReturn<IntakeInput>,
) {
  switch (stepId) {
    case "disclaimer":
      return <DisclaimerStep />;
    case "appointment":
      return <AppointmentStep />;
    case "worries":
      return <WorriesStep />;
    case "history":
      return <HistoryStep />;
    case "communication":
      return <CommunicationStep />;
    case "coping":
      return <CopingStep />;
    case "details":
      return <OptionalDetailsStep />;
    case "review":
      return <ReviewStep values={form.getValues()} />;
    default:
      return null;
  }
}

function DisclaimerStep() {
  const {
    formState: { errors },
    register,
  } = useFormContext<IntakeInput>();

  return (
    <StepFrame
      eyebrow="Before you begin"
      title="A quick note about what SmileAtEase can and cannot do."
      description="This intake is for visit preparation and communication. It does not replace professional care."
      requiredNote
    >
      <Alert>
        SmileAtEase does not diagnose, treat, or provide medical, dental, mental
        health, medication, emergency, or sedation advice.
      </Alert>
      <label className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm font-medium text-foreground">
        <input
          className="mt-0.5 h-4 w-4 accent-primary"
          type="checkbox"
          {...register("disclaimer_acknowledged")}
        />
        <span>
          I understand and want to continue.
          <span className="ml-2 rounded-full border border-primary/20 bg-sky/15 px-2 py-0.5 text-xs font-semibold text-primary">
            Required
          </span>
        </span>
      </label>
      <FieldError message={errors.disclaimer_acknowledged?.message} />
    </StepFrame>
  );
}

function ReviewStep({ values }: { values: IntakeInput }) {
  return (
    <StepFrame
      eyebrow="Review"
      title="Review your answers."
      description="When everything looks right, generate your visit preparation plan."
    >
      <div className="grid gap-4">
        <SummarySection
          items={[
            [
              "Visit timing",
              getOptionLabel(appointmentStatusOptions, values.appointment_status),
            ],
            ["Visit type", getOptionLabel(visitTypeOptions, values.visit_type)],
            ["Plan for", getOptionLabel(planForOptions, values.plan_for)],
          ]}
          title="Appointment"
        />
        <SummarySection
          items={[
            ["Selected worries", getOptionLabels(worryOptions, values.worries)],
            [
              "Biggest worry",
              getOptionLabel(worryOptions, values.biggest_worry),
            ],
          ]}
          title="Worries"
        />
        <SummarySection
          items={[
            ["Last visit", getOptionLabel(lastVisitOptions, values.last_visit)],
            [
              "Past visit experience",
              getOptionLabel(
                badExperienceLevelOptions,
                values.bad_experience_level,
              ),
            ],
            [
              "Past experience note",
              values.include_bad_experience_note
                ? getOptionLabel(
                    includeBadExperienceNoteOptions,
                    values.include_bad_experience_note,
                  )
                : "Not included",
            ],
          ]}
          title="History"
        />
        <SummarySection
          items={[
            [
              "Preferences",
              getOptionLabels(
                communicationPreferenceOptions,
                values.communication_preferences,
              ),
            ],
            [
              "Style",
              getOptionLabel(
                communicationStyleOptions,
                values.communication_style,
              ),
            ],
          ]}
          title="Communication"
        />
        <SummarySection
          items={[
            [
              "Coping preferences",
              getOptionLabels(copingPreferenceOptions, values.coping_preferences),
            ],
            [
              "Calming script",
              values.include_calming_script ? "Included" : "Not included",
            ],
            [
              "Optional context",
              values.optional_context?.trim() || "Not provided",
            ],
          ]}
          title="Coping and details"
        />
      </div>
    </StepFrame>
  );
}

function SummarySection({
  items,
  title,
}: {
  items: [string, string | string[]][];
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(([label, value]) => (
          <div className="grid gap-1 sm:grid-cols-[12rem_1fr]" key={label}>
            <dt className="text-sm font-medium text-muted-foreground">
              {label}
            </dt>
            <dd className="text-sm leading-6 text-foreground">
              {Array.isArray(value) ? value.join(", ") : value}
            </dd>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
