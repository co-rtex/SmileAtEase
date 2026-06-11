import { ComfortCardPreview } from "./ComfortCardPreview";

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
      <div className="absolute -right-4 top-7 h-16 w-16 rounded-full bg-yellow/35 blur-xl" />
      <div className="absolute -left-5 bottom-10 h-20 w-20 rounded-full bg-lavender/35 blur-xl" />
      <div className="absolute right-10 top-0 h-10 w-16 rounded-b-full rounded-t-[2rem] border border-primary/15 bg-surface/60 shadow-soft" />
      <div className="absolute -left-2 top-7 rounded-full border border-coral/35 bg-surface/80 px-3 py-1 text-xs font-semibold text-foreground shadow-soft">
        Visit plan
      </div>
      <ComfortCardPreview />
    </div>
  );
}
