import Link from "next/link";

import { BrandMark } from "@/components/brand/BrandMark";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-surface/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex max-w-2xl items-start gap-3">
          <BrandMark className="mt-0.5 h-8 w-8 rounded-lg" />
          <div>
            <p className="font-semibold text-foreground">SmileAtEase</p>
            <p className="mt-1 max-w-xl leading-6">
              Educational visit preparation, comfort preferences, and questions to
              ask. Not a replacement for professional care.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 font-medium sm:justify-end">
          <Link className="rounded-md px-1.5 py-1 transition-colors hover:bg-yellow/25 hover:text-foreground" href="/guides">
            Guides
          </Link>
          <Link className="rounded-md px-1.5 py-1 transition-colors hover:bg-yellow/25 hover:text-foreground" href="/privacy">
            Privacy
          </Link>
          <Link className="rounded-md px-1.5 py-1 transition-colors hover:bg-yellow/25 hover:text-foreground" href="/terms">
            Terms
          </Link>
          <Link className="rounded-md px-1.5 py-1 transition-colors hover:bg-yellow/25 hover:text-foreground" href="/about">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
