import Link from "next/link";

import { BrandMark } from "@/components/brand/BrandMark";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-lg font-semibold tracking-normal text-foreground"
        >
          <BrandMark className="h-8 w-8 rounded-lg" />
          SmileAtEase
        </Link>
        <nav className="flex items-center gap-3 text-sm text-muted-foreground sm:gap-5">
          <Link
            className="hidden rounded-md px-2 py-2 transition-colors hover:bg-yellow/25 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:inline-flex"
            href="/guides"
          >
            Guides
          </Link>
          <Link
            className="rounded-md px-2 py-2 transition-colors hover:bg-yellow/25 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            href="/example"
          >
            Example
          </Link>
          <Button href="/start" className="hidden sm:inline-flex">
            Start
          </Button>
          <Button href="/start" className="px-3 sm:hidden">
            Start
          </Button>
        </nav>
      </div>
    </header>
  );
}
