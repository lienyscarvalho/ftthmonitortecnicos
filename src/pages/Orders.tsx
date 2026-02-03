import { ServiceOrderList } from '@/components/orders/ServiceOrderList';
import { OrderStats } from '@/components/dashboard/DashboardStats';

export default function Orders() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
        <p className="text-muted-foreground">Gerencie as ordens de serviço</p>
      </div>
      <OrderStats />
      <ServiceOrderList />
    </div>
  );
}
