import { z } from "zod";

import {
  appointmentStatusOptions,
  badExperienceLevelOptions,
  communicationPreferenceOptions,
  communicationStyleOptions,
  copingPreferenceOptions,
  includeBadExperienceNoteOptions,
  lastVisitOptions,
  planForOptions,
  visitTypeOptions,
  worryOptions,
  type IntakeOption,
} from "./constants";

function optionValues<T extends readonly IntakeOption[]>(options: T) {
  return options.map((option) => option.value) as [
    T[number]["value"],
    ...T[number]["value"][],
  ];
}

function requiredOptionEnum<T extends readonly IntakeOption[]>(
  options: T,
  message: string,
) {
  return z.enum(optionValues(options), {
    invalid_type_error: message,
    required_error: message,
  });
}

const appointmentStatusEnum = requiredOptionEnum(
  appointmentStatusOptions,
  "Please choose when the visit is, even if it is not scheduled yet.",
);
const visitTypeEnum = requiredOptionEnum(
  visitTypeOptions,
  "Please choose the closest visit type. “Not sure” is okay.",
);
const planForEnum = requiredOptionEnum(
  planForOptions,
  "Please choose who this plan is for.",
);
const worryEnum = requiredOptionEnum(
  worryOptions,
  "Please choose one of the worries listed here.",
);
const biggestWorryEnum = requiredOptionEnum(
  worryOptions,
  "Please choose the one worry that feels most important right now.",
);
const lastVisitEnum = requiredOptionEnum(
  lastVisitOptions,
  "Please choose the closest answer for your last visit.",
);
const badExperienceLevelEnum = requiredOptionEnum(
  badExperienceLevelOptions,
  "Please choose how past visits felt, or choose “Prefer not to say.”",
);
const includeBadExperienceNoteEnum = z.enum(
  optionValues(includeBadExperienceNoteOptions),
);
const communicationPreferenceEnum = z.enum(
  optionValues(communicationPreferenceOptions),
);
const communicationStyleEnum = requiredOptionEnum(
  communicationStyleOptions,
  "Please choose the communication style that feels best.",
);
const copingPreferenceEnum = z.enum(optionValues(copingPreferenceOptions));
const urgentSymptomEnum = z.enum([
  "trouble_breathing_swallowing",
  "rapid_swelling",
  "fever_with_dental_pain",
  "uncontrolled_bleeding",
  "severe_injury",
  "none",
]);
const selfHarmRiskEnum = z.enum(["no", "yes", "prefer_not_to_say"]);

export const intakeSchema = z
  .object({
    appointment_status: appointmentStatusEnum,
    visit_type: visitTypeEnum,
    plan_for: planForEnum,
    worries: z
      .array(worryEnum)
      .min(1, "Please choose at least one worry so the plan knows what to focus on."),
    biggest_worry: biggestWorryEnum,
    last_visit: lastVisitEnum,
    bad_experience_level: badExperienceLevelEnum,
    include_bad_experience_note: includeBadExperienceNoteEnum.nullable(),
    communication_preferences: z
      .array(communicationPreferenceEnum)
      .min(
        1,
        "Please choose at least one communication preference for your comfort card.",
      ),
    communication_style: communicationStyleEnum,
    coping_preferences: z.array(copingPreferenceEnum).default([]),
    include_calming_script: z.boolean(),
    optional_context: z
      .string()
      .max(700, "Please keep this under 700 characters. A short note is plenty.")
      .optional(),
    urgent_symptoms: z
      .array(urgentSymptomEnum)
      .min(1, "Please choose one option for urgent symptoms."),
    self_harm_risk: selfHarmRiskEnum,
    disclaimer_acknowledged: z
      .boolean()
      .refine(
        (value) => value,
        "Please check this box to confirm you understand before continuing.",
      ),
  })
  .superRefine((value, ctx) => {
    if (!value.worries.includes(value.biggest_worry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Please choose your biggest worry from the worries you selected above.",
        path: ["biggest_worry"],
      });
    }

    if (
      value.urgent_symptoms.includes("none") &&
      value.urgent_symptoms.length > 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Please choose either “None” or specific symptoms, but not both.",
        path: ["urgent_symptoms"],
      });
    }
  });

export type IntakeInput = z.infer<typeof intakeSchema>;
