export function ComfortCardPreview() {
  return (
    <div className="relative">
      <div className="absolute -right-5 -top-4 h-24 w-24 rounded-full bg-coral/20 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-sky/25 blur-2xl" />
      <div className="absolute left-3 top-3 h-full w-full rounded-xl border border-lavender/35 bg-lavender/15 shadow-soft" />
      <div className="relative rounded-xl border border-primary/20 bg-surface/95 p-4 shadow-panel sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-primary/10 pb-4">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-sky/40 bg-sky/15 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">
              Printable card
            </div>
            <h3 className="mt-1 text-xl font-semibold text-foreground">
              My Visit Comfort Card
            </h3>
          </div>
          <div className="relative h-11 w-11 shrink-0 rounded-[0.9rem] bg-gradient-to-br from-yellow via-coral/55 to-sky shadow-sm">
            <div className="absolute left-2.5 top-4 h-2 w-6 rounded-b-full border-b-2 border-primary/70" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              What helps me
            </h4>
            <ul className="mt-2.5 space-y-2 text-sm leading-6 text-muted-foreground">
              {[
                "Calm, clear communication",
                "Short breaks if needed",
                "Explaining each step before starting",
              ].map((item) => (
                <li className="flex gap-2.5" key={item}>
                  <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
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
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-lavender/50 bg-lavender/15 p-3.5">
            <h4 className="text-sm font-semibold text-foreground">
              Before we begin
            </h4>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              I would like to agree on a simple pause signal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
