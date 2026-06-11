import type { IntakeInput } from "./intakeSchema";
import {
  deletePlanResponseSchema,
  generatePlanResponseSchema,
  getPlanResponseSchema,
  type DeletePlanResponse,
  type GeneratePlanResponse,
  type GetPlanResponse,
} from "./planSchema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function generatePlan(
  intake: IntakeInput,
): Promise<GeneratePlanResponse> {
  const json = await requestJson("/api/plans/generate", {
    body: JSON.stringify({ intake }),
    method: "POST",
  });

  return generatePlanResponseSchema.parse(json);
}

export async function getPlan(planId: string): Promise<GetPlanResponse> {
  const json = await requestJson(`/api/plans/${encodeURIComponent(planId)}`);

  return getPlanResponseSchema.parse(json);
}

export async function deletePlan(
  planId: string,
): Promise<DeletePlanResponse> {
  const json = await requestJson(`/api/plans/${encodeURIComponent(planId)}`, {
    method: "DELETE",
  });

  return deletePlanResponseSchema.parse(json);
}

async function requestJson(
  path: string,
  init: RequestInit = {},
): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  } catch {
    throw new Error("Unable to reach SmileAtEase. Please check your connection.");
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  try {
    return await response.json();
  } catch {
    throw new Error("SmileAtEase returned an unreadable response.");
  }
}

async function getErrorMessage(response: Response) {
  try {
    const body = await response.json();

    if (
      typeof body === "object" &&
      body !== null &&
      "detail" in body &&
      typeof body.detail === "string"
    ) {
      return body.detail;
    }
  } catch {
    // Fall back to status text below.
  }

  return response.statusText || "SmileAtEase could not complete the request.";
}
