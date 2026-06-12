"use client";

import { useMemo, useState } from "react";

import { explorerItems, getExplorerItemById } from "@/lib/explorerItems";
import type { ExplorerItem } from "@/lib/explorerSchema";

import { ExplorerCompletion } from "./ExplorerCompletion";
import { ExplorerInfoPanel } from "./ExplorerInfoPanel";
import { ExplorerIntro } from "./ExplorerIntro";
import { ExplorerListView } from "./ExplorerListView";
import { ExplorerScene } from "./ExplorerScene";
import { ExplorerToolbar } from "./ExplorerToolbar";

export function ExplorerPage() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set());
  const selectedItem = useMemo(
    () => getExplorerItemById(selectedItemId),
    [selectedItemId],
  );
  const exploredCount = exploredIds.size;
  const completed = exploredCount === explorerItems.length;

  function selectItem(item: ExplorerItem) {
    setSelectedItemId(item.id);
    setExploredIds((current) => {
      const next = new Set(current);
      next.add(item.id);
      return next;
    });
  }

  function resetExplorer() {
    setSelectedItemId(null);
    setExploredIds(new Set());
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <ExplorerIntro />
      <ExplorerToolbar
        exploredCount={exploredCount}
        totalCount={explorerItems.length}
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)] lg:items-start">
        <ExplorerScene
          exploredIds={exploredIds}
          items={explorerItems}
          onSelect={selectItem}
          selectedItemId={selectedItemId}
        />
        <ExplorerInfoPanel item={selectedItem} />
      </div>
      <ExplorerListView
        exploredIds={exploredIds}
        items={explorerItems}
        onSelect={selectItem}
        selectedItemId={selectedItemId}
      />
      {completed ? <ExplorerCompletion onReset={resetExplorer} /> : null}
    </div>
  );
}
