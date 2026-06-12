type ExplorerProgressProps = {
  exploredCount: number;
  totalCount: number;
};

export function ExplorerProgress({
  exploredCount,
  totalCount,
}: ExplorerProgressProps) {
  const percentage = totalCount === 0 ? 0 : (exploredCount / totalCount) * 100;

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-foreground">
          {exploredCount} of {totalCount} tools explored
        </span>
        <span className="text-muted-foreground">
          {Math.round(percentage)}%
        </span>
      </div>
      <div
        aria-label={`${exploredCount} of ${totalCount} dental tools explored`}
        aria-valuemax={totalCount}
        aria-valuemin={0}
        aria-valuenow={exploredCount}
        className="h-3 overflow-hidden rounded-full border border-primary/15 bg-surface-soft"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary via-sky to-coral transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
