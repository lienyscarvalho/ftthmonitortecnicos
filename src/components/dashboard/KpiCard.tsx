import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

export function KpiCard({ title, value, subtitle, trend, trendLabel, icon, highlight = false }: KpiCardProps) {
  const TrendIcon = trend && trend > 0 ? TrendingUp : trend && trend < 0 ? TrendingDown : Minus;
  const trendColor = trend && trend > 0 ? 'text-success' : trend && trend < 0 ? 'text-destructive' : 'text-muted-foreground';

  return (
    <Card className={`border-border/50 transition-all duration-300 hover:border-primary/30 ${highlight ? 'border-primary/50 shadow-[0_0_15px_rgba(255,200,0,0.1)]' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground truncate">{title}</p>
            <p className="text-2xl font-bold font-mono text-primary leading-none">
              {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            </p>
            {subtitle && <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>}
            {trend !== undefined && (
              <div className={`flex items-center gap-1 text-[10px] ${trendColor}`}>
                <TrendIcon className="h-3 w-3" />
                <span>{trend > 0 ? '+' : ''}{trend}%</span>
                {trendLabel && <span className="text-muted-foreground">vs {trendLabel}</span>}
              </div>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
