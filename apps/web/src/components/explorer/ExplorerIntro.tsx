import { Button } from "@/components/ui/Button";

export function ExplorerIntro() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-surface-soft via-background to-sky/25 p-5 shadow-soft sm:p-8">
      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-yellow/30 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-lavender/35 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Meet the dental tools
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
            Meet the Dental Tools
          </h1>
          <p className="text-base leading-8 text-muted-foreground">
            Click common tools on the tray to learn what they do, what they may
            feel like, and what you can ask the dental team.
          </p>
          <p className="border-l-2 border-primary/35 pl-3 text-sm leading-6 text-muted-foreground">
            This is educational preparation only. It does not diagnose, treat,
            or replace professional care.
          </p>
        </div>
        <Button href="/start">Create my visit plan</Button>
      </div>
    </section>
  );
}
