import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GaugeChart } from './GaugeChart';
import { KpiCard } from './KpiCard';
import { StatusBar } from './StatusBar';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Wrench, Activity, Clock, CheckCircle2, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

const COLORS = {
  primary: 'hsl(48, 100%, 50%)',
  success: 'hsl(120, 60%, 40%)',
  warning: 'hsl(48, 80%, 45%)',
  danger: 'hsl(0, 72%, 51%)',
  muted: 'hsl(0, 0%, 30%)',
  accent: 'hsl(30, 90%, 50%)',
};

export function CockpitDashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: technicians, isLoading: techLoading } = useTechnicians();
  const { data: orders, isLoading: ordersLoading } = useServiceOrders();

  if (statsLoading || techLoading || ordersLoading) return <LoadingSkeleton />;

  const totalTech = stats?.totalTechnicians || 0;
  const availTech = stats?.availableTechnicians || 0;
  const busyTech = stats?.busyTechnicians || 0;
  const offlineTech = stats?.offlineTechnicians || 0;
  const totalOrders = stats?.totalOrders || 0;
  const pendingOrders = stats?.pendingOrders || 0;
  const inProgressOrders = stats?.inProgressOrders || 0;
  const completedOrders = stats?.completedOrders || 0;

  const presencaPct = totalTech > 0 ? ((availTech + busyTech) / totalTech) * 100 : 0;
  const capacidade = (availTech + busyTech) * 8; // hours per day
  const capacidadePlan = totalTech * 8;
  const produtividade = (availTech + busyTech) > 0 ? totalOrders / (availTech + busyTech) : 0;
  const eficiencia = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Status by type data
  const statusData = [
    { name: 'Instalação', value: orders?.filter(o => o.service_type === 'installation').length || 0, fill: COLORS.primary },
    { name: 'Manutenção', value: orders?.filter(o => o.service_type === 'maintenance').length || 0, fill: COLORS.success },
    { name: 'Reparo', value: orders?.filter(o => o.service_type === 'repair').length || 0, fill: COLORS.accent },
  ];

  // Priority data
  const priorityData = [
    { name: 'Normal', pendentes: orders?.filter(o => o.priority === 'normal' && o.status === 'pending').length || 0, concluidas: orders?.filter(o => o.priority === 'normal' && o.status === 'completed').length || 0 },
    { name: 'Alta', pendentes: orders?.filter(o => o.priority === 'high' && o.status === 'pending').length || 0, concluidas: orders?.filter(o => o.priority === 'high' && o.status === 'completed').length || 0 },
    { name: 'Urgente', pendentes: orders?.filter(o => o.priority === 'urgent' && o.status === 'pending').length || 0, concluidas: orders?.filter(o => o.priority === 'urgent' && o.status === 'completed').length || 0 },
  ];

  // Technician status breakdown for bar chart
  const techStatusData = [
    { name: 'Disponível', value: availTech, fill: COLORS.success },
    { name: 'Ocupado', value: busyTech, fill: COLORS.warning },
    { name: 'Offline', value: offlineTech, fill: COLORS.muted },
  ];

  // Orders by status for area simulation
  const ordersStatusData = [
    { name: 'Pendente', value: pendingOrders, fill: COLORS.warning },
    { name: 'Em Progresso', value: inProgressOrders, fill: COLORS.primary },
    { name: 'Concluída', value: completedOrders, fill: COLORS.success },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary font-mono tracking-wider">CockPit</h1>
          <p className="text-xs text-muted-foreground">Planejamento e Controle da Produção</p>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> Até 50%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Até 80%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Acima 80%</span>
        </div>
      </div>

      {/* Gauges Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex flex-col items-center">
            <GaugeChart value={availTech + busyTech} max={totalTech || 1} label="Presença Real" size="md" />
            <div className="mt-2 text-center">
              <span className="text-xs text-muted-foreground">Meta: </span>
              <span className="text-xs text-primary font-mono">{totalTech}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 flex flex-col items-center">
            <GaugeChart value={capacidade} max={capacidadePlan || 1} label="Capacidade Prod. Real" unit="h" size="md" />
            <div className="mt-2 text-center">
              <span className="text-xs text-muted-foreground">Plan: </span>
              <span className="text-xs text-primary font-mono">{capacidadePlan.toLocaleString('pt-BR')}h</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 flex flex-col items-center">
            <GaugeChart value={produtividade} max={Math.max(produtividade * 1.2, 5)} label="Produtividade Real" size="md" />
            <div className="mt-2 text-center">
              <span className="text-xs text-muted-foreground">OS/Técnico: </span>
              <span className="text-xs text-primary font-mono">{produtividade.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          title="Técnicos Total"
          value={totalTech}
          icon={<Users className="h-4 w-4" />}
          highlight
        />
        <KpiCard
          title="Disponíveis"
          value={availTech}
          subtitle={`${presencaPct.toFixed(0)}% presença`}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <KpiCard
          title="Em Atendimento"
          value={busyTech}
          icon={<Activity className="h-4 w-4" />}
        />
        <KpiCard
          title="Offline"
          value={offlineTech}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          title="Total OS"
          value={totalOrders}
          icon={<Wrench className="h-4 w-4" />}
          highlight
        />
        <KpiCard
          title="Pendentes"
          value={pendingOrders}
          icon={<Clock className="h-4 w-4" />}
        />
        <KpiCard
          title="Em Progresso"
          value={inProgressOrders}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KpiCard
          title="Concluídas"
          value={completedOrders}
          subtitle={`${eficiencia.toFixed(0)}% eficiência`}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* % Meta vs Tipo de Serviço */}
        <Card className="border-border/50">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm text-primary font-mono">% Meta vs. Tipo de Serviço</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(0, 0%, 55%)', fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(0, 0%, 55%)', fontSize: 11 }} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(0, 0%, 9%)', border: '1px solid hsl(0, 0%, 18%)', borderRadius: 8, color: 'hsl(50, 10%, 90%)' }}
                  labelStyle={{ color: 'hsl(48, 100%, 50%)' }}
                />
                <Bar dataKey="value" name="Quantidade" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* OS por Prioridade */}
        <Card className="border-border/50">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm text-primary font-mono">OS por Prioridade</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={priorityData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(0, 0%, 55%)', fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(0, 0%, 55%)', fontSize: 11 }} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(0, 0%, 9%)', border: '1px solid hsl(0, 0%, 18%)', borderRadius: 8, color: 'hsl(50, 10%, 90%)' }}
                  labelStyle={{ color: 'hsl(48, 100%, 50%)' }}
                />
                <Bar dataKey="pendentes" name="Pendentes" fill={COLORS.warning} radius={[4, 4, 0, 0]} />
                <Bar dataKey="concluidas" name="Concluídas" fill={COLORS.success} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Status Bars + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm text-primary font-mono">Status Técnicos</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <StatusBar value={availTech} max={totalTech || 1} label="Disponíveis" />
            <StatusBar value={busyTech} max={totalTech || 1} label="Em Atendimento" />
            <StatusBar value={offlineTech} max={totalTech || 1} label="Offline" />
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm text-primary font-mono">Distribuição OS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={ordersStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  stroke="none"
                >
                  {ordersStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(0, 0%, 9%)', border: '1px solid hsl(0, 0%, 18%)', borderRadius: 8, color: 'hsl(50, 10%, 90%)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-3 text-[10px]">
              {ordersStatusData.map((d, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                  {d.name}: {d.value}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm text-primary font-mono">Eficiência</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <StatusBar value={completedOrders} max={totalOrders || 1} label="Taxa Conclusão" />
            <StatusBar value={totalOrders - pendingOrders} max={totalOrders || 1} label="OS Atribuídas" />
            <StatusBar value={availTech + busyTech} max={totalTech || 1} label="Presença" />
            <div className="pt-2 border-t border-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Produtividade</span>
                <span className="text-primary font-mono font-bold">{produtividade.toFixed(2)} OS/Téc</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
