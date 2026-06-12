import { useState } from "react";

import { explorerImage } from "@/lib/explorerItems";
import type { ExplorerItem } from "@/lib/explorerSchema";

import { ExplorerHotspot } from "./ExplorerHotspot";

type ExplorerSceneProps = {
  exploredIds: Set<string>;
  items: ExplorerItem[];
  onSelect: (item: ExplorerItem) => void;
  selectedItemId: string | null;
};

export function ExplorerScene({
  exploredIds,
  items,
  onSelect,
  selectedItemId,
}: ExplorerSceneProps) {
  const [imageUnavailable, setImageUnavailable] = useState(false);

  return (
    <section
      aria-label="Dental tool tray with clickable tools"
      className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-sky/15 via-surface to-yellow/15 p-3 shadow-panel"
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2 px-1">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Dental tool tray
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            Click a marker on the tray, or use the list below.
          </p>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          8 tools to explore
        </span>
      </div>
      <div className="relative aspect-video min-h-[18rem] overflow-hidden rounded-xl border border-border/70 bg-surface-soft sm:min-h-[22rem]">
        {!imageUnavailable ? (
          <>
            <img
              alt={explorerImage.alt}
              className="h-full w-full object-contain"
              draggable={false}
              onError={() => setImageUnavailable(true)}
              src={explorerImage.src}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/5 via-transparent to-surface/5" />
            {items.map((item, index) => (
              <ExplorerHotspot
                explored={exploredIds.has(item.id)}
                item={item}
                key={item.id}
                markerNumber={index + 1}
                onSelect={onSelect}
                selected={selectedItemId === item.id}
              />
            ))}
          </>
        ) : (
          <div className="flex h-full min-h-[18rem] items-center justify-center p-6 sm:min-h-[22rem]">
            <div className="max-w-md rounded-xl border border-border/70 bg-surface-soft/80 p-5 text-center shadow-soft">
              <h2 className="text-xl font-semibold text-foreground">
                Tool tray image unavailable
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                You can still explore every tool using the list view below.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
