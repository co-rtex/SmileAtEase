import type { ExplorerItem } from "@/lib/explorerSchema";
import { cn } from "@/lib/utils";

type ExplorerHotspotProps = {
  explored: boolean;
  item: ExplorerItem;
  markerNumber: number;
  onSelect: (item: ExplorerItem) => void;
  selected: boolean;
};

export function ExplorerHotspot({
  explored,
  item,
  markerNumber,
  onSelect,
  selected,
}: ExplorerHotspotProps) {
  return (
    <button
      aria-label={`Learn about ${item.name}`}
      aria-pressed={selected}
      className={cn(
        "group absolute z-10 flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-bold shadow-panel backdrop-blur-sm transition-all",
        "hover:-translate-y-[55%] hover:scale-105 hover:border-primary hover:bg-yellow/85 hover:shadow-panel",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        selected
          ? "border-coral bg-coral text-white ring-4 ring-coral/25"
          : "border-white/90 bg-primary/90 text-white",
        explored && !selected && "border-white bg-sky text-foreground",
      )}
      onClick={() => onSelect(item)}
      style={{ left: `${item.x}%`, top: `${item.y}%` }}
      type="button"
    >
      <span aria-hidden="true" className="text-sm leading-none">
        {explored ? "✓" : markerNumber}
      </span>
      <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.4rem)] z-20 max-w-36 -translate-x-1/2 whitespace-nowrap rounded-full border border-primary/20 bg-surface px-3 py-1 text-[11px] font-semibold text-foreground opacity-0 shadow-soft transition-opacity group-hover:opacity-100 group-focus:opacity-100">
        {item.shortLabel}
      </span>
      <span className="sr-only">
        {explored ? " Explored." : " Not explored yet."}
      </span>
    </button>
  );
}
