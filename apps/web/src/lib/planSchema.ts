import { z } from "zod";

export const safetyStatusSchema = z.enum([
  "standard",
  "urgent_dental_or_medical",
  "crisis",
  "boundary",
  "fallback",
]);

export const comfortCardSchema = z.object({
  intro: z.string(),
  my_concerns: z.array(z.string()),
  what_helps_me: z.array(z.string()),
  pause_signal: z.string(),
  communication_preference: z.string(),
});

export const planSchema = z.object({
  safety_status: safetyStatusSchema,
  title: z.string(),
  gentle_summary: z.string(),
  main_concerns: z.array(z.string()),
  before_visit: z.array(z.string()),
  when_you_arrive: z.array(z.string()),
  during_visit: z.array(z.string()),
  if_overwhelmed: z.array(z.string()),
  questions_to_ask: z.array(z.string()),
  comfort_card: comfortCardSchema,
  important_reminder: z.string(),
  blocked_or_redirect_message: z.string().nullable(),
});

export const generatePlanResponseSchema = z.object({
  plan_id: z.string(),
  assessment_id: z.string(),
  safety_status: safetyStatusSchema,
  plan: planSchema,
});

export const getPlanResponseSchema = z.object({
  plan_id: z.string(),
  assessment_id: z.string(),
  safety_status: safetyStatusSchema,
  plan: planSchema,
});

export const deletePlanResponseSchema = z.object({
  deleted: z.boolean(),
});

export type SafetyStatus = z.infer<typeof safetyStatusSchema>;
export type ComfortCard = z.infer<typeof comfortCardSchema>;
export type Plan = z.infer<typeof planSchema>;
export type GeneratePlanResponse = z.infer<typeof generatePlanResponseSchema>;
export type GetPlanResponse = z.infer<typeof getPlanResponseSchema>;
export type DeletePlanResponse = z.infer<typeof deletePlanResponseSchema>;
