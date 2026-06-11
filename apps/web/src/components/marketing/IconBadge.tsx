import { cn } from "@/lib/utils";

type IconBadgeProps = {
  icon: "question" | "checklist" | "card" | "chat" | "book" | "sparkle" | "shield";
  className?: string;
};

export function IconBadge({ icon, className }: IconBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/15 bg-surface/90 text-primary shadow-sm",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        {icon === "question" ? (
          <>
            <path d="M9.5 9a2.7 2.7 0 1 1 4.2 2.2c-.9.6-1.7 1.2-1.7 2.3" />
            <path d="M12 17h.01" />
            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </>
        ) : null}
        {icon === "checklist" ? (
          <>
            <path d="M9 6h11" />
            <path d="M9 12h11" />
            <path d="M9 18h11" />
            <path d="m4 6 1 1 2-2" />
            <path d="m4 12 1 1 2-2" />
            <path d="m4 18 1 1 2-2" />
          </>
        ) : null}
        {icon === "card" ? (
          <>
            <rect height="14" rx="3" width="18" x="3" y="5" />
            <path d="M7 10h6" />
            <path d="M7 14h10" />
          </>
        ) : null}
        {icon === "chat" ? (
          <>
            <path d="M21 12a7 7 0 0 1-7 7H8l-5 3 1.5-5A7 7 0 1 1 21 12Z" />
            <path d="M8 11h8" />
            <path d="M8 14h5" />
          </>
        ) : null}
        {icon === "book" ? (
          <>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 0 4 19.5Z" />
          </>
        ) : null}
        {icon === "sparkle" ? (
          <>
            <path d="M12 3 9.8 8.8 4 11l5.8 2.2L12 19l2.2-5.8L20 11l-5.8-2.2L12 3Z" />
            <path d="m19 3-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2Z" />
          </>
        ) : null}
        {icon === "shield" ? (
          <>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-5" />
          </>
        ) : null}
      </svg>
    </span>
  );
}
