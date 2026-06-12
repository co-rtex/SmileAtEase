import type { Metadata } from "next";

import { ExplorerPage } from "@/components/explorer/ExplorerPage";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Meet the Dental Tools | SmileAtEase",
  description:
    "Click common tools on a realistic dental tray to learn what they do and what you can ask before your visit.",
};

export default function ExplorePage() {
  return (
    <PageShell className="flex-1">
      <ExplorerPage />
    </PageShell>
  );
}
