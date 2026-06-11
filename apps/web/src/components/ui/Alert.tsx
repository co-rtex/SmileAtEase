import { cn } from "@/lib/utils";

export function Alert({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-yellow/70 bg-yellow/25 p-4 text-sm leading-6 text-foreground",
        className,
      )}
      role="note"
      {...props}
    />
  );
}
