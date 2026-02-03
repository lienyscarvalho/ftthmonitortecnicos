import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  color: 'primary' | 'success' | 'warning' | 'destructive' | 'accent';
}

function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Técnicos Total"
        value={stats?.totalTechnicians || 0}
        icon={<Users className="h-5 w-5" />}
        color="primary"
      />
      <StatCard
        title="Disponíveis"
        value={stats?.availableTechnicians || 0}
        icon={<CheckCircle2 className="h-5 w-5" />}
        color="success"
      />
      <StatCard
        title="Em Atendimento"
        value={stats?.busyTechnicians || 0}
        icon={<Activity className="h-5 w-5" />}
        color="warning"
      />
      <StatCard
        title="OS Pendentes"
        value={stats?.pendingOrders || 0}
        icon={<Clock className="h-5 w-5" />}
        color="destructive"
      />
    </div>
  );
}

export function OrderStats() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total de OS"
        value={stats?.totalOrders || 0}
        icon={<AlertCircle className="h-5 w-5" />}
        color="primary"
      />
      <StatCard
        title="Pendentes"
        value={stats?.pendingOrders || 0}
        icon={<Clock className="h-5 w-5" />}
        color="warning"
      />
      <StatCard
        title="Em Progresso"
        value={stats?.inProgressOrders || 0}
        icon={<Activity className="h-5 w-5" />}
        color="accent"
      />
      <StatCard
        title="Concluídas"
        value={stats?.completedOrders || 0}
        icon={<CheckCircle2 className="h-5 w-5" />}
        color="success"
      />
    </div>
  );
}
