import type { ExplorerItem } from "@/lib/explorerSchema";
import { cn } from "@/lib/utils";

type ExplorerListViewProps = {
  exploredIds: Set<string>;
  items: ExplorerItem[];
  onSelect: (item: ExplorerItem) => void;
  selectedItemId: string | null;
};

export function ExplorerListView({
  exploredIds,
  items,
  onSelect,
  selectedItemId,
}: ExplorerListViewProps) {
  return (
    <section className="space-y-4">
      <div className="max-w-2xl space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          List view
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Explore by tool
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Prefer a list? These buttons open the same learning cards as the tray
          hotspots.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const explored = exploredIds.has(item.id);
          const selected = selectedItemId === item.id;

          return (
            <button
              aria-pressed={selected}
              className={cn(
                "rounded-lg border bg-surface/95 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:bg-surface-soft hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                selected
                  ? "border-coral bg-coral/10 ring-1 ring-coral/40"
                  : "border-border/80",
              )}
              key={item.id}
              onClick={() => onSelect(item)}
              type="button"
            >
              <span className="block text-sm font-semibold text-foreground">
                {item.name}
              </span>
              <span className="mt-2 block text-xs font-medium text-primary">
                {explored ? "Explored" : "Not explored yet"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
