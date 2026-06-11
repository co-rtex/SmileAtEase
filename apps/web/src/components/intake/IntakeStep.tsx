"use client";

import type { FieldPath } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import type { IntakeOption } from "@/lib/constants";
import type { IntakeInput } from "@/lib/intakeSchema";
import { cn } from "@/lib/utils";

type StepFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  requiredNote?: boolean;
};

export function StepFrame({
  eyebrow,
  title,
  description,
  children,
  requiredNote = false,
}: StepFrameProps) {
  return (
    <div className="space-y-7">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="leading-7 text-muted-foreground">{description}</p>
        {requiredNote ? (
          <p className="inline-flex rounded-full border border-primary/15 bg-sky/15 px-3 py-1 text-xs font-semibold text-primary">
            Required sections are marked below.
          </p>
        ) : null}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-md border border-coral/40 bg-coral/10 px-3 py-2 text-sm font-medium leading-6 text-red-800">
      {message}
    </p>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="flex flex-wrap items-center gap-2 text-base font-semibold text-foreground">
      <span>{children}</span>
      {required ? (
        <span className="rounded-full border border-primary/20 bg-sky/15 px-2 py-0.5 text-xs font-semibold text-primary">
          Required
        </span>
      ) : null}
    </span>
  );
}

type RadioOptionsProps = {
  name: FieldPath<IntakeInput>;
  legend: string;
  options: readonly IntakeOption[];
  error?: string;
  columns?: "one" | "two" | "three";
  helperText?: string;
  required?: boolean;
  emptyMessage?: string;
};

export function RadioOptions({
  name,
  legend,
  options,
  error,
  columns = "two",
  helperText,
  required = false,
  emptyMessage,
}: RadioOptionsProps) {
  const { register, watch } = useFormContext<IntakeInput>();
  const currentValue = watch(name);

  return (
    <fieldset className="space-y-3">
      <legend>
        <FieldLabel required={required}>{legend}</FieldLabel>
      </legend>
      {helperText ? (
        <p className="text-sm leading-6 text-muted-foreground">{helperText}</p>
      ) : null}
      {options.length > 0 ? (
        <div
          className={cn(
            "grid gap-3",
            columns === "two" && "sm:grid-cols-2",
            columns === "three" && "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {options.map((option) => {
            const selected = currentValue === option.value;

            return (
              <label
                className={cn(
                  "flex cursor-pointer rounded-lg border border-border/80 bg-surface p-4 text-sm font-medium text-foreground shadow-sm transition-all",
                  "hover:-translate-y-0.5 hover:border-primary/60 hover:bg-surface-soft hover:shadow-soft",
                  selected && "border-primary bg-sky/20 ring-1 ring-primary shadow-soft",
                )}
                key={option.value}
              >
                <input
                  className="sr-only"
                  type="radio"
                  value={option.value}
                  {...register(name)}
                />
                {option.label}
              </label>
            );
          })}
        </div>
      ) : (
        <p className="rounded-lg border border-border/70 bg-surface-soft/70 p-3 text-sm leading-6 text-muted-foreground">
          {emptyMessage ?? "Choose an answer above first."}
        </p>
      )}
      <FieldError message={error} />
    </fieldset>
  );
}

type CheckboxOptionsProps = {
  name:
    | "worries"
    | "communication_preferences"
    | "coping_preferences";
  legend: string;
  options: readonly IntakeOption[];
  error?: string;
  columns?: "one" | "two" | "three";
  helperText?: string;
  required?: boolean;
};

export function CheckboxOptions({
  name,
  legend,
  options,
  error,
  columns = "two",
  helperText,
  required = false,
}: CheckboxOptionsProps) {
  const { register, watch } = useFormContext<IntakeInput>();
  const selectedValues = (watch(name) ?? []) as string[];

  return (
    <fieldset className="space-y-3">
      <legend>
        <FieldLabel required={required}>{legend}</FieldLabel>
      </legend>
      {helperText ? (
        <p className="text-sm leading-6 text-muted-foreground">{helperText}</p>
      ) : null}
      <div
        className={cn(
          "grid gap-3",
          columns === "two" && "sm:grid-cols-2",
          columns === "three" && "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {options.map((option) => {
          const selected = selectedValues.includes(option.value);

          return (
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border border-border/80 bg-surface p-4 text-sm font-medium text-foreground shadow-sm transition-all",
                "hover:-translate-y-0.5 hover:border-primary/60 hover:bg-surface-soft hover:shadow-soft",
                selected && "border-primary bg-sky/20 ring-1 ring-primary shadow-soft",
              )}
              key={option.value}
            >
              <input
                className="mt-0.5 h-4 w-4 accent-primary"
                type="checkbox"
                value={option.value}
                {...register(name)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}
