"use client";

import { Button } from "@/components/ui/Button";

export function PrintButton() {
  return (
    <Button onClick={() => window.print()} type="button" variant="secondary">
      Print
    </Button>
  );
}
