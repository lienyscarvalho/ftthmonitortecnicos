import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
}

const COLORS_SEGMENTS = [
  'hsl(0, 72%, 40%)',    // red
  'hsl(48, 90%, 45%)',   // yellow
  'hsl(120, 55%, 35%)',  // green
];

export function DonutChart({ value, max, label, unit = '', size = 'md' }: DonutChartProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  const sizeConfig = {
    sm: { dim: 130, inner: 42, outer: 56, fontSize: 'text-lg', labelSize: 'text-[10px]' },
    md: { dim: 160, inner: 52, outer: 68, fontSize: 'text-2xl', labelSize: 'text-xs' },
    lg: { dim: 200, inner: 65, outer: 85, fontSize: 'text-3xl', labelSize: 'text-sm' },
  };

  const cfg = sizeConfig[size];

  const getColor = (pct: number) => {
    if (pct >= 80) return 'hsl(120, 60%, 40%)';
    if (pct >= 50) return 'hsl(48, 100%, 50%)';
    return 'hsl(0, 72%, 51%)';
  };

  // Background ring segments (red, yellow, green)
  const bgData = [
    { name: 'Vermelho', value: 33.3 },
    { name: 'Amarelo', value: 33.4 },
    { name: 'Verde', value: 33.3 },
  ];

  // Foreground value ring
  const valueData = [
    { name: 'Valor', value: percentage },
    { name: 'Vazio', value: 100 - percentage },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: cfg.dim, height: cfg.dim }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Background segments */}
            <Pie
              data={bgData}
              cx="50%"
              cy="50%"
              innerRadius={cfg.inner}
              outerRadius={cfg.outer}
              startAngle={225}
              endAngle={-45}
              dataKey="value"
              stroke="none"
              isAnimationActive={false}
            >
              {bgData.map((_, i) => (
                <Cell key={i} fill={COLORS_SEGMENTS[i]} opacity={0.3} />
              ))}
            </Pie>
            {/* Value arc */}
            <Pie
              data={valueData}
              cx="50%"
              cy="50%"
              innerRadius={cfg.inner - 2}
              outerRadius={cfg.outer + 2}
              startAngle={225}
              endAngle={225 - (percentage / 100) * 270}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
            >
              <Cell fill={getColor(percentage)} />
              <Cell fill="transparent" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${cfg.fontSize} font-bold font-mono`} style={{ color: getColor(percentage) }}>
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <span className={`${cfg.labelSize} text-muted-foreground mt-1`}>{label}</span>
      <span className="text-primary font-mono font-bold text-sm">
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}{unit}
      </span>
    </div>
  );
}
