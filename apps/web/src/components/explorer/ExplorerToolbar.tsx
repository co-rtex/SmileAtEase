import { ExplorerProgress } from "./ExplorerProgress";

type ExplorerToolbarProps = {
  exploredCount: number;
  totalCount: number;
};

export function ExplorerToolbar({
  exploredCount,
  totalCount,
}: ExplorerToolbarProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface/90 p-4 shadow-soft">
      <ExplorerProgress exploredCount={exploredCount} totalCount={totalCount} />
    </div>
  );
}
