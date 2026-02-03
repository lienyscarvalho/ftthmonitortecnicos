import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type ServiceOrder = Database['public']['Tables']['service_orders']['Row'];
type ServiceOrderInsert = Database['public']['Tables']['service_orders']['Insert'];
type ServiceOrderUpdate = Database['public']['Tables']['service_orders']['Update'];

export type ServiceOrderWithTechnician = ServiceOrder & {
  technicians: { name: string; status: string } | null;
};

export function useServiceOrders() {
  return useQuery({
    queryKey: ['service_orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          technicians (
            name,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ServiceOrderWithTechnician[];
    },
  });
}

interface CreateServiceOrderInput {
  customer_name: string;
  customer_address: string;
  customer_phone?: string | null;
  service_type: 'installation' | 'maintenance' | 'repair';
  priority: 'normal' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  technician_id?: string | null;
  notes?: string | null;
}

export function useCreateServiceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: CreateServiceOrderInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('service_orders')
        .insert([{
          customer_name: order.customer_name,
          customer_address: order.customer_address,
          customer_phone: order.customer_phone,
          service_type: order.service_type,
          priority: order.priority,
          status: order.status,
          technician_id: order.technician_id,
          notes: order.notes,
          created_by: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
      toast.success('Ordem de serviço criada!');
    },
    onError: (error) => {
      toast.error('Erro ao criar OS', {
        description: error.message,
      });
    },
  });
}

export function useUpdateServiceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: ServiceOrderUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('service_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
      toast.success('OS atualizada!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar OS', {
        description: error.message,
      });
    },
  });
}

export function useDeleteServiceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
      toast.success('OS removida!');
    },
    onError: (error) => {
      toast.error('Erro ao remover OS', {
        description: error.message,
      });
    },
  });
}
