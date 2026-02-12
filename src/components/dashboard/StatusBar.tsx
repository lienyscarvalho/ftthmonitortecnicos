interface StatusBarProps {
  value: number;
  max: number;
  label: string;
  showPercentage?: boolean;
}

export function StatusBar({ value, max, label, showPercentage = true }: StatusBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  
  const getColor = (p: number) => {
    if (p >= 80) return 'bg-success';
    if (p >= 50) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">{label}</span>
        {showPercentage && <span className="text-primary font-mono font-bold">{pct.toFixed(0)}%</span>}
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
