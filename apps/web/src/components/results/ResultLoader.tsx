"use client";

import { useEffect, useState } from "react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getPlan } from "@/lib/api";
import type { GetPlanResponse } from "@/lib/planSchema";

import { PlanRenderer } from "./PlanRenderer";

type ResultLoaderProps = {
  planId: string;
};

const LOAD_ERROR =
  "Sorry, we could not load this plan. It may have expired or been deleted.";

export function ResultLoader({ planId }: ResultLoaderProps) {
  const [response, setResponse] = useState<GetPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPlan() {
      try {
        const planResponse = await getPlan(planId);

        if (isMounted) {
          setResponse(planResponse);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError(LOAD_ERROR);
          setResponse(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPlan();

    return () => {
      isMounted = false;
    };
  }, [planId]);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-4xl py-12 md:py-16">
        <Card className="border-primary/15 bg-surface/90">
          <CardContent className="space-y-4 p-6">
            <div className="h-2 w-32 rounded-full bg-gradient-to-r from-primary via-sky to-coral" />
            <p className="text-sm text-muted-foreground">
              Loading your visit plan...
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (error || response === null) {
    return (
      <section className="mx-auto w-full max-w-4xl py-12 md:py-16">
        <div className="rounded-xl border border-red-200 bg-red-50/90 p-5 shadow-soft">
          <Alert className="border-red-200 bg-white/60 text-red-900">
            {error ?? LOAD_ERROR}
          </Alert>
          <div className="mt-6 print:hidden">
            <Button href="/start">Start Over</Button>
          </div>
        </div>
      </section>
    );
  }

  return <PlanRenderer response={response} />;
}
