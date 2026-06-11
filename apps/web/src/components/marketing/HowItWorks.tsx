import { FeatureCard } from "./FeatureCard";
import { SectionHeader } from "./SectionHeader";

const steps = [
  {
    title: "Answer a few simple questions",
    description:
      "Share visit details, main worries, communication preferences, and comfort tools.",
    accent: "sky" as const,
    icon: "question" as const,
  },
  {
    title: "Get a personalized visit plan",
    description:
      "Receive a concise plan organized around before, during, and after your visit.",
    accent: "yellow" as const,
    icon: "checklist" as const,
  },
  {
    title: "Bring your comfort card",
    description:
      "Use a short printable card to share what helps with the dental team.",
    accent: "lavender" as const,
    icon: "card" as const,
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border/70 bg-surface/75">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="Three simple steps."
          description="A focused flow turns your answers into practical preparation."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <FeatureCard
              accent={step.accent}
              description={step.description}
              icon={step.icon}
              key={step.title}
              title={step.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
