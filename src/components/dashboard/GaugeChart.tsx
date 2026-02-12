import { useMemo } from 'react';

interface GaugeChartProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function GaugeChart({ value, max, label, unit = '', size = 'md' }: GaugeChartProps) {
  const percentage = useMemo(() => Math.min((value / max) * 100, 100), [value, max]);

  const sizeConfig = {
    sm: { width: 140, height: 80, strokeWidth: 10, fontSize: 'text-lg', labelSize: 'text-[10px]' },
    md: { width: 180, height: 100, strokeWidth: 12, fontSize: 'text-2xl', labelSize: 'text-xs' },
    lg: { width: 220, height: 120, strokeWidth: 14, fontSize: 'text-3xl', labelSize: 'text-sm' },
  };

  const cfg = sizeConfig[size];
  const cx = cfg.width / 2;
  const cy = cfg.height - 10;
  const radius = cx - cfg.strokeWidth;
  
  const getColor = (pct: number) => {
    if (pct >= 80) return 'hsl(120, 60%, 40%)';
    if (pct >= 50) return 'hsl(48, 100%, 50%)';
    return 'hsl(0, 72%, 51%)';
  };

  const startAngle = Math.PI;
  const endAngle = 0;
  const sweepAngle = startAngle - endAngle;
  const valueAngle = startAngle - (percentage / 100) * sweepAngle;

  const describeArc = (startA: number, endA: number) => {
    const x1 = cx + radius * Math.cos(startA);
    const y1 = cy - radius * Math.sin(startA);
    const x2 = cx + radius * Math.cos(endA);
    const y2 = cy - radius * Math.sin(endA);
    const largeArc = Math.abs(startA - endA) > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`;
  };

  // Create segmented background
  const segments = [
    { start: Math.PI, end: Math.PI * 0.667, color: 'hsl(0, 72%, 25%)' },
    { start: Math.PI * 0.667, end: Math.PI * 0.333, color: 'hsl(48, 80%, 25%)' },
    { start: Math.PI * 0.333, end: 0, color: 'hsl(120, 50%, 20%)' },
  ];

  return (
    <div className="flex flex-col items-center">
      <svg width={cfg.width} height={cfg.height + 10} viewBox={`0 0 ${cfg.width} ${cfg.height + 10}`}>
        {/* Background segments */}
        {segments.map((seg, i) => (
          <path
            key={i}
            d={describeArc(seg.start, seg.end)}
            fill="none"
            stroke={seg.color}
            strokeWidth={cfg.strokeWidth}
            strokeLinecap="butt"
          />
        ))}
        
        {/* Value arc */}
        {percentage > 0 && (
          <path
            d={describeArc(startAngle, valueAngle)}
            fill="none"
            stroke={getColor(percentage)}
            strokeWidth={cfg.strokeWidth + 2}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${getColor(percentage)})` }}
          />
        )}

        {/* Needle */}
        {(() => {
          const needleAngle = startAngle - (percentage / 100) * sweepAngle;
          const needleLen = radius - 15;
          const nx = cx + needleLen * Math.cos(needleAngle);
          const ny = cy - needleLen * Math.sin(needleAngle);
          return (
            <>
              <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="hsl(0, 72%, 51%)" strokeWidth={2} />
              <circle cx={cx} cy={cy} r={4} fill="hsl(0, 72%, 51%)" />
            </>
          );
        })()}

        {/* Value text */}
        <text x={cx} y={cy - 15} textAnchor="middle" className={`${cfg.fontSize} font-bold`} fill="hsl(48, 100%, 50%)" fontSize={size === 'sm' ? 16 : size === 'md' ? 22 : 28}>
          {percentage.toFixed(1)}%
        </text>
      </svg>
      <span className={`${cfg.labelSize} text-muted-foreground mt-1`}>{label}</span>
      <span className="text-primary font-mono font-bold text-sm">
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}{unit}
      </span>
    </div>
  );
}
