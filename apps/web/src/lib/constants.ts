export type IntakeOption<T extends string = string> = {
  value: T;
  label: string;
};

export const appointmentStatusOptions = [
  { value: "within_week", label: "Within the next week" },
  { value: "within_month", label: "Within the next month" },
  { value: "later_than_month", label: "Later than a month from now" },
  { value: "not_scheduled", label: "Not scheduled yet" },
  { value: "thinking_about_scheduling", label: "Thinking about scheduling" },
] as const satisfies readonly IntakeOption[];

export const visitTypeOptions = [
  { value: "cleaning_checkup", label: "Cleaning or checkup" },
  { value: "first_visit_long_time", label: "First visit in a long time" },
  { value: "filling", label: "Filling" },
  { value: "urgent_concern", label: "Urgent concern" },
  { value: "extraction_consult", label: "Extraction consult" },
  { value: "deep_cleaning", label: "Deep cleaning" },
  { value: "not_sure", label: "Not sure" },
  { value: "other", label: "Other" },
] as const satisfies readonly IntakeOption[];

export const planForOptions = [
  { value: "me", label: "Me" },
  { value: "child", label: "My child" },
  { value: "family_member", label: "A family member" },
  { value: "someone_i_support", label: "Someone I support" },
] as const satisfies readonly IntakeOption[];

export const worryOptions = [
  { value: "pain", label: "Pain" },
  { value: "needles", label: "Needles" },
  { value: "drill_sounds", label: "Drill sounds" },
  { value: "embarrassment", label: "Embarrassment" },
  { value: "judgment", label: "Feeling judged" },
  { value: "not_knowing", label: "Not knowing what will happen" },
  { value: "cost", label: "Cost" },
  { value: "gagging", label: "Gagging" },
  { value: "loss_of_control", label: "Loss of control" },
  { value: "bad_past_experience", label: "A bad past experience" },
  { value: "sensory", label: "Sensory discomfort" },
  { value: "mouth_open", label: "Keeping my mouth open" },
  { value: "bad_news", label: "Hearing bad news" },
  { value: "communication", label: "Communication" },
  { value: "other", label: "Other" },
] as const satisfies readonly IntakeOption[];

export const lastVisitOptions = [
  { value: "within_6_months", label: "Within the last 6 months" },
  { value: "six_to_twelve_months", label: "6 to 12 months ago" },
  { value: "one_to_two_years", label: "1 to 2 years ago" },
  { value: "more_than_two_years", label: "More than 2 years ago" },
  { value: "do_not_remember", label: "I do not remember" },
  { value: "never", label: "Never" },
] as const satisfies readonly IntakeOption[];

export const badExperienceLevelOptions = [
  { value: "no", label: "No" },
  { value: "mildly_upsetting", label: "Mildly upsetting" },
  { value: "very_upsetting", label: "Very upsetting" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const satisfies readonly IntakeOption[];

export const includeBadExperienceNoteOptions = [
  { value: "yes_gentle_note", label: "Yes, include a gentle note" },
  { value: "no_keep_private", label: "No, keep it private" },
  {
    value: "only_extra_communication",
    label: "Only mention that extra communication helps",
  },
] as const satisfies readonly IntakeOption[];

export const communicationPreferenceOptions = [
  { value: "explain_each_step", label: "Explain each step" },
  { value: "ask_before_starting", label: "Ask before starting" },
  { value: "check_in_during_visit", label: "Check in during the visit" },
  { value: "hand_signal", label: "Use a hand signal" },
  { value: "short_breaks", label: "Offer short breaks" },
  { value: "know_sounds_sensations", label: "Describe sounds and sensations" },
  { value: "cost_before_treatment", label: "Discuss costs before additional care" },
  { value: "support_person", label: "Allow a support person if possible" },
  { value: "fewer_details", label: "Use fewer details" },
  { value: "detailed_explanations", label: "Use detailed explanations" },
] as const satisfies readonly IntakeOption[];

export const communicationStyleOptions = [
  { value: "calm_direct", label: "Calm and direct" },
  { value: "very_detailed", label: "Very detailed" },
  { value: "simple_brief", label: "Simple and brief" },
  { value: "ask_before_details", label: "Ask before giving details" },
] as const satisfies readonly IntakeOption[];

export const copingPreferenceOptions = [
  { value: "headphones", label: "Headphones" },
  { value: "counting", label: "Counting" },
  { value: "stress_object", label: "Stress object" },
  { value: "breaks", label: "Breaks" },
  { value: "support_person", label: "Support person" },
  { value: "close_eyes", label: "Closing my eyes" },
] as const satisfies readonly IntakeOption[];

export function getOptionLabel(
  options: readonly IntakeOption[],
  value: string | null | undefined,
) {
  if (value == null) {
    return "Not selected";
  }

  return options.find((option) => option.value === value)?.label ?? value;
}

export function getOptionLabels(
  options: readonly IntakeOption[],
  values: readonly string[] | undefined,
) {
  if (!values?.length) {
    return ["None selected"];
  }

  return values.map((value) => getOptionLabel(options, value));
}
