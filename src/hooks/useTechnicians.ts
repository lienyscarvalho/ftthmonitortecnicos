import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Technician = Database['public']['Tables']['technicians']['Row'];
type TechnicianInsert = Database['public']['Tables']['technicians']['Insert'];
type TechnicianUpdate = Database['public']['Tables']['technicians']['Update'];

export function useTechnicians() {
  return useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Technician[];
    },
  });
}

export function useCreateTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (technician: TechnicianInsert) => {
      const { data, error } = await supabase
        .from('technicians')
        .insert(technician)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      toast.success('Técnico criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar técnico', {
        description: error.message,
      });
    },
  });
}

export function useUpdateTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: TechnicianUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('technicians')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      toast.success('Técnico atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar técnico', {
        description: error.message,
      });
    },
  });
}

export function useDeleteTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('technicians')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      toast.success('Técnico removido!');
    },
    onError: (error) => {
      toast.error('Erro ao remover técnico', {
        description: error.message,
      });
    },
  });
}
