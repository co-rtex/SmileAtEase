import { PageShell } from "@/components/layout/PageShell";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { HeroVisual } from "@/components/marketing/HeroVisual";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { Button } from "@/components/ui/Button";

const trustPills = [
  "Made for nervous patients",
  "Communication-first",
  "Non-diagnostic",
];

const features = [
  {
    title: "Visit prep plan",
    description:
      "A clear plan for before, during, and after your appointment.",
    accent: "sky" as const,
    icon: "checklist" as const,
  },
  {
    title: "Comfort card",
    description:
      "A short printable note that explains what helps you feel comfortable.",
    accent: "yellow" as const,
    icon: "card" as const,
  },
  {
    title: "Questions to ask",
    description: "Simple prompts you can bring to the dental team.",
    accent: "coral" as const,
    icon: "chat" as const,
  },
  {
    title: "Procedure guides",
    description: "Plain-language guides for common dental visits.",
    accent: "lavender" as const,
    icon: "book" as const,
  },
];

export default function HomePage() {
  return (
    <PageShell className="flex-1">
      <section className="relative overflow-hidden bg-gradient-to-br from-surface-soft via-background to-sky/25">
        <div className="absolute -left-12 top-0 h-44 w-44 rounded-full bg-yellow/30 blur-3xl" />
        <div className="absolute -right-16 bottom-6 h-56 w-56 rounded-full bg-lavender/30 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 pb-10 pt-10 sm:px-6 md:pb-12 md:pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Feel more prepared before your dental visit.
            </p>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl lg:text-6xl">
                Feel more prepared before your dental visit.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                SmileAtEase helps nervous dental patients create a simple visit
                plan with comfort preferences, questions to ask, and a card they
                can bring to the dental office.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/start">Create my visit plan</Button>
              <Button href="/example" variant="secondary">
                See an example
              </Button>
            </div>
            <p className="max-w-2xl border-l-2 border-primary/35 pl-3 text-sm leading-6 text-muted-foreground">
              Educational preparation only. Not medical, dental, mental health,
              medication, sedation, diagnosis, treatment, or emergency advice.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {trustPills.map((pill) => (
                <span
                  className="rounded-full border border-primary/15 bg-surface/70 px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                  key={pill}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      <HowItWorks />

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
        <SectionHeader
          eyebrow="What you get"
          title="A short plan you can actually use."
          description="Everything is written to be easy to scan before the visit or bring with you."
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              accent={feature.accent}
              description={feature.description}
              icon={feature.icon}
              key={feature.title}
              title={feature.title}
            />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-lavender/25 via-surface-soft to-yellow/25">
        <div className="absolute -left-10 top-4 h-24 w-24 rounded-full bg-coral/20 blur-2xl" />
        <div className="absolute -right-8 bottom-0 h-28 w-28 rounded-full bg-sky/25 blur-2xl" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_0.8fr] md:items-center md:py-9 lg:px-8">
          <SectionHeader
            title="Ready to feel more prepared?"
            description="Create a visit plan in a few minutes, then copy or print your comfort card."
          />
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Button href="/start">Create my visit plan</Button>
            <Button href="/example" variant="secondary">
              See an example
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
