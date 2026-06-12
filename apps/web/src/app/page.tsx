import { PageShell } from "@/components/layout/PageShell";
import { HeroVisual } from "@/components/marketing/HeroVisual";
import { IconBadge } from "@/components/marketing/IconBadge";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const trustPills = [
  "Made for nervous patients",
  "Communication-first",
  "Non-diagnostic",
];

const mainPaths = [
  {
    title: "Create My Visit Plan",
    label: "Personalized comfort card",
    description:
      "Answer a few simple questions about your visit, worries, and comfort preferences. SmileAtEase creates a clear plan and a comfort card you can copy, print, or bring to the dental office.",
    bullets: [
      "Organize your worries",
      "Prepare questions to ask",
      "Create a comfort card",
    ],
    cta: "Start my plan",
    href: "/start",
    accent: "sky" as const,
    icon: "card" as const,
    preview: "plan" as const,
  },
  {
    title: "Meet the Dental Tools",
    label: "Interactive tool explorer",
    description:
      "Click around a realistic dental tool tray to learn what common tools do, what you may notice, and what you can ask the dental team before they use them.",
    bullets: [
      "Recognize common tools",
      "Learn what each one does",
      "Reduce uncertainty before the visit",
    ],
    cta: "Explore the tools",
    href: "/explore",
    accent: "coral" as const,
    icon: "sparkle" as const,
    preview: "tools" as const,
  },
];

const helpPoints = [
  {
    title: "Know what to expect",
    description:
      "Preview visit steps and common tools in plain language before you arrive.",
    icon: "question" as const,
  },
  {
    title: "Prepare what to say",
    description:
      "Turn worries and preferences into simple questions for the dental team.",
    icon: "chat" as const,
  },
  {
    title: "Bring a simple plan",
    description:
      "Use a short plan or comfort card when you want communication to feel easier.",
    icon: "checklist" as const,
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
              SmileAtEase
            </p>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl lg:text-6xl">
                Feel more prepared before your dental visit.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                SmileAtEase helps you prepare with a personalized visit plan
                and a realistic tool explorer, so the dental office feels less
                unfamiliar before you arrive.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/start">Create my visit plan</Button>
              <Button href="/explore" variant="secondary">
                Meet the dental tools
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

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
        <SectionHeader
          eyebrow="Two ways to prepare"
          title="Choose the path that helps you most."
          description="Create a visit plan, meet the dental tools, or use both before your appointment."
        />

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {mainPaths.map((path) => (
            <PrimaryPathCard key={path.title} path={path} />
          ))}
        </div>
      </section>

      <section className="border-y border-border/70 bg-surface/75">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
          <SectionHeader
            eyebrow="How it helps"
            title="A little preparation can make the room feel more familiar."
            description="Use SmileAtEase to gather your thoughts before the visit and bring clearer questions with you."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {helpPoints.map((point) => (
              <Card
                className="border-primary/15 bg-surface/95 transition-all hover:-translate-y-0.5 hover:shadow-panel"
                key={point.title}
              >
                <CardHeader className="p-5 pb-2">
                  <IconBadge
                    className="mb-2 border-sky/50 bg-sky/15 text-primary"
                    icon={point.icon}
                  />
                  <CardTitle className="text-lg">{point.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-2">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-lavender/25 via-surface-soft to-yellow/25">
        <div className="absolute -left-10 top-4 h-24 w-24 rounded-full bg-coral/20 blur-2xl" />
        <div className="absolute -right-8 bottom-0 h-28 w-28 rounded-full bg-sky/25 blur-2xl" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_0.8fr] md:items-center md:py-9 lg:px-8">
          <SectionHeader
            title="Ready to prepare your way?"
            description="Create a visit plan, explore the tools, or use both before your appointment."
          />
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Button href="/start">Create my visit plan</Button>
            <Button href="/explore" variant="secondary">
              Meet the dental tools
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

type PrimaryPathCardProps = {
  path: (typeof mainPaths)[number];
};

function PrimaryPathCard({ path }: PrimaryPathCardProps) {
  const accentClass =
    path.accent === "sky"
      ? "from-sky/50 via-surface to-lavender/20"
      : "from-yellow/50 via-surface to-coral/20";

  return (
    <Card className="group relative h-full overflow-hidden border-primary/15 bg-surface/95 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-panel">
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accentClass}`} />
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-sky/20 blur-3xl transition-opacity group-hover:opacity-100" />
      <CardHeader className="relative space-y-4 p-5 pb-3 sm:p-6 sm:pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <IconBadge
            className={
              path.accent === "sky"
                ? "border-sky/50 bg-sky/20 text-primary"
                : "border-coral/45 bg-coral/15 text-foreground"
            }
            icon={path.icon}
          />
          <span className="rounded-full border border-primary/15 bg-surface-soft px-3 py-1 text-xs font-semibold text-primary">
            {path.label}
          </span>
        </div>
        <CardTitle className="text-2xl">{path.title}</CardTitle>
      </CardHeader>
      <CardContent className="relative grid gap-5 p-5 pt-2 sm:p-6 sm:pt-2">
        <p className="text-sm leading-7 text-muted-foreground">
          {path.description}
        </p>
        {path.preview === "plan" ? <MiniPlanPreview /> : <MiniToolPreview />}
        <ul className="grid gap-2">
          {path.bullets.map((bullet) => (
            <li
              className="flex gap-2 text-sm font-medium text-foreground"
              key={bullet}
            >
              <span
                aria-hidden="true"
                className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <svg
                  aria-hidden="true"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <div>
          <Button href={path.href}>{path.cta}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniPlanPreview() {
  return (
    <div className="rounded-xl border border-sky/30 bg-sky/10 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">Comfort card</p>
        <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-primary">
          Printable
        </span>
      </div>
      <div className="space-y-2 text-sm leading-6 text-muted-foreground">
        <p>What helps me: calm communication, short breaks, clear steps.</p>
        <p>Before we begin: agree on a simple pause signal.</p>
      </div>
    </div>
  );
}

function MiniToolPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-coral/25 bg-surface-soft shadow-sm">
      <div className="relative aspect-video">
        <img
          alt="A close-up preview of a dental tool tray."
          className="h-full w-full object-cover"
          src="/images/explorer/dental-tool-tray.png"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 rounded-full border border-white/50 bg-surface/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
          Interactive tray
        </div>
      </div>
    </div>
  );
}
