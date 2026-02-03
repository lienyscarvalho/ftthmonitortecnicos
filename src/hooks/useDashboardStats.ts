import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalTechnicians: number;
  availableTechnicians: number;
  busyTechnicians: number;
  offlineTechnicians: number;
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  todayOrders: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Get technicians stats
      const { data: technicians, error: techError } = await supabase
        .from('technicians')
        .select('status');

      if (techError) throw techError;

      const techStats = {
        total: technicians?.length || 0,
        available: technicians?.filter(t => t.status === 'available').length || 0,
        busy: technicians?.filter(t => t.status === 'busy').length || 0,
        offline: technicians?.filter(t => t.status === 'offline').length || 0,
      };

      // Get service orders stats
      const { data: orders, error: ordersError } = await supabase
        .from('service_orders')
        .select('status, created_at');

      if (ordersError) throw ordersError;

      const today = new Date().toISOString().split('T')[0];
      
      const orderStats = {
        total: orders?.length || 0,
        pending: orders?.filter(o => o.status === 'pending').length || 0,
        inProgress: orders?.filter(o => o.status === 'in_progress').length || 0,
        completed: orders?.filter(o => o.status === 'completed').length || 0,
        today: orders?.filter(o => o.created_at.startsWith(today)).length || 0,
      };

      return {
        totalTechnicians: techStats.total,
        availableTechnicians: techStats.available,
        busyTechnicians: techStats.busy,
        offlineTechnicians: techStats.offline,
        totalOrders: orderStats.total,
        pendingOrders: orderStats.pending,
        inProgressOrders: orderStats.inProgress,
        completedOrders: orderStats.completed,
        todayOrders: orderStats.today,
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
