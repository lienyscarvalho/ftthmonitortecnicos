import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  pending: { label: 'Pendente', className: 'bg-warning/20 text-warning' },
  assigned: { label: 'Atribuída', className: 'bg-primary/20 text-primary' },
  in_progress: { label: 'Em Progresso', className: 'bg-accent/20 text-accent' },
  completed: { label: 'Concluída', className: 'bg-success/20 text-success' },
  cancelled: { label: 'Cancelada', className: 'bg-muted text-muted-foreground' },
};

const techStatusConfig = {
  available: { label: 'Disponível', className: 'bg-success text-success-foreground' },
  busy: { label: 'Em Atendimento', className: 'bg-warning text-warning-foreground' },
  offline: { label: 'Offline', className: 'bg-muted text-muted-foreground' },
};

export default function Dashboard() {
  const { data: technicians } = useTechnicians();
  const { data: orders } = useServiceOrders();

  const recentOrders = orders?.slice(0, 5);
  const activeTechnicians = technicians?.filter(t => t.status !== 'offline').slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema de monitoramento</p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ordens de Serviço Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders?.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                Nenhuma OS encontrada
              </p>
            ) : (
              recentOrders?.map((order) => {
                const status = statusConfig[order.status];
                return (
                  <div key={order.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">{order.order_number}</span>
                        <Badge variant="outline" className={status.className}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{order.customer_name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{order.customer_address}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Active Technicians */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Técnicos Ativos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTechnicians?.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                Nenhum técnico ativo
              </p>
            ) : (
              activeTechnicians?.map((tech) => {
                const status = techStatusConfig[tech.status];
                return (
                  <div key={tech.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{tech.name}</p>
                      {tech.current_address && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{tech.current_address}</span>
                        </div>
                      )}
                    </div>
                    <Badge className={status.className}>
                      {status.label}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
