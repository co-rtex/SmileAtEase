"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

type CopyButtonProps = {
  getText: () => string;
  label: string;
};

export function CopyButton({ getText, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button onClick={copyText} type="button" variant="secondary">
      {copied ? "Copied" : label}
    </Button>
  );
}
