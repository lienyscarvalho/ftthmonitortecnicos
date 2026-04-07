import { ServiceOrderList } from '@/components/orders/ServiceOrderList';
import { OrderStats } from '@/components/dashboard/DashboardStats';
import { ExportPdfButton } from '@/components/ExportPdfButton';

export default function Orders() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
          <p className="text-muted-foreground">Gerencie as ordens de serviço</p>
        </div>
        <ExportPdfButton targetId="orders-content" fileName="ordens_servico" />
      </div>
      <div id="orders-content">
        <OrderStats />
        <ServiceOrderList />
      </div>
    </div>
  );
}
