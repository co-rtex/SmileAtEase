import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-sky to-coral shadow-panel",
        className,
      )}
    >
      <span className="absolute inset-1 rounded-lg bg-surface/88" />
      <span className="relative h-3.5 w-5 rounded-b-full border-b-2 border-primary" />
      <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-yellow" />
    </span>
  );
}
