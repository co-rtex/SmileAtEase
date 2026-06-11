import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { IconBadge } from "./IconBadge";

type FeatureCardProps = {
  title: string;
  description: string;
  accent?: "sky" | "yellow" | "coral" | "lavender";
  icon?: React.ComponentProps<typeof IconBadge>["icon"];
  label?: string;
};

const accents = {
  sky: {
    border: "border-sky/50",
    line: "bg-sky",
    wash: "bg-sky/10",
    icon: "border-sky/50 bg-sky/20 text-primary",
  },
  yellow: {
    border: "border-yellow/60",
    line: "bg-yellow",
    wash: "bg-yellow/20",
    icon: "border-yellow/70 bg-yellow/25 text-foreground",
  },
  coral: {
    border: "border-coral/50",
    line: "bg-coral",
    wash: "bg-coral/10",
    icon: "border-coral/50 bg-coral/20 text-foreground",
  },
  lavender: {
    border: "border-lavender/60",
    line: "bg-lavender",
    wash: "bg-lavender/20",
    icon: "border-lavender/60 bg-lavender/25 text-foreground",
  },
};

export function FeatureCard({
  title,
  description,
  accent = "sky",
  icon,
  label,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "group relative h-full overflow-hidden bg-surface/95 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-panel",
        accents[accent].border,
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-1", accents[accent].line)} />
      <div
        className={cn(
          "absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-opacity group-hover:opacity-100",
          accents[accent].wash,
        )}
      />
      <CardHeader className="relative p-5 pb-2">
        {icon ? (
          <IconBadge
            className={cn("mb-1 shadow-sm", accents[accent].icon)}
            icon={icon}
          />
        ) : null}
        {!icon && label ? (
          <div
            className={cn(
              "mb-2 flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold shadow-sm",
              accents[accent].icon,
            )}
          >
            {label}
          </div>
        ) : null}
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative p-5 pt-2">
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
