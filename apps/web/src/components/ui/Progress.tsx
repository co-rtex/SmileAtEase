import { cn } from "@/lib/utils";

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
};

export function Progress({ className, value = 0, ...props }: ProgressProps) {
  const normalizedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      role="progressbar"
      {...props}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary via-sky to-coral transition-all"
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}
