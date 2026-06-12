import { Button } from "@/components/ui/Button";

type ExplorerCompletionProps = {
  onReset: () => void;
};

export function ExplorerCompletion({ onReset }: ExplorerCompletionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-lavender/25 via-surface-soft to-yellow/25 p-5 shadow-soft sm:p-6">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-coral/20 blur-2xl" />
      <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Explorer complete
          </p>
          <h2 className="text-2xl font-semibold text-foreground">
            You explored the tool tray.
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Now these tools may feel a little more familiar. You can create a
            visit plan next or explore the tools again.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/start">Create my visit plan</Button>
          <Button onClick={onReset} type="button" variant="secondary">
            Explore again
          </Button>
        </div>
      </div>
    </section>
  );
}
