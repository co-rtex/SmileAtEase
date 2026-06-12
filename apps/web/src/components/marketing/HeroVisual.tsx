export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
      <div className="absolute -right-4 top-7 h-16 w-16 rounded-full bg-yellow/35 blur-xl" />
      <div className="absolute -left-5 bottom-10 h-20 w-20 rounded-full bg-lavender/35 blur-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <HeroPreviewCard label="Visit Plan Preview" tone="sky">
          <div className="space-y-3">
            <div className="rounded-lg border border-sky/30 bg-sky/10 p-3">
              <h3 className="text-sm font-semibold text-foreground">
                My Visit Comfort Card
              </h3>
              <ul className="mt-2 space-y-1.5 text-xs leading-5 text-muted-foreground">
                <li>Calm, clear communication</li>
                <li>Short breaks if needed</li>
                <li>Explain each step first</li>
              </ul>
            </div>
            <div className="h-2 rounded-full bg-primary/15">
              <div className="h-full w-2/3 rounded-full bg-primary" />
            </div>
          </div>
        </HeroPreviewCard>

        <HeroPreviewCard label="Tool Explorer Preview" tone="coral">
          <div className="overflow-hidden rounded-lg border border-coral/25 bg-surface-soft">
            <div className="relative aspect-video">
              <img
                alt="A close-up preview of a dental tool tray."
                className="h-full w-full object-cover"
                src="/images/explorer/dental-tool-tray.png"
              />
              <div className="absolute left-[13%] top-[54%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-soft" />
              <div className="absolute left-[53%] top-[55%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-coral shadow-soft" />
              <div className="absolute left-[79%] top-[62%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-yellow shadow-soft" />
            </div>
          </div>
        </HeroPreviewCard>
      </div>
    </div>
  );
}

function HeroPreviewCard({
  children,
  label,
  tone,
}: {
  children: React.ReactNode;
  label: string;
  tone: "sky" | "coral";
}) {
  return (
    <div className="relative rounded-xl border border-primary/15 bg-surface/95 p-4 shadow-panel">
      <div
        className={
          tone === "sky"
            ? "absolute inset-x-0 top-0 h-1 rounded-t-xl bg-sky"
            : "absolute inset-x-0 top-0 h-1 rounded-t-xl bg-coral"
        }
      />
      <div className="mb-3 inline-flex rounded-full border border-primary/15 bg-surface-soft px-3 py-1 text-xs font-semibold text-primary">
        {label}
      </div>
      {children}
    </div>
  );
}
