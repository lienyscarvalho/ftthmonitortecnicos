import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MapPin, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Search,
  Plus,
  Clock,
  User,
  Phone
} from 'lucide-react';
import { useServiceOrders, useDeleteServiceOrder } from '@/hooks/useServiceOrders';
import { Skeleton } from '@/components/ui/skeleton';
import { ServiceOrderDialog } from './ServiceOrderDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  pending: { label: 'Pendente', className: 'bg-warning/20 text-warning border-warning/30' },
  assigned: { label: 'Atribuída', className: 'bg-primary/20 text-primary border-primary/30' },
  in_progress: { label: 'Em Progresso', className: 'bg-accent/20 text-accent border-accent/30' },
  completed: { label: 'Concluída', className: 'bg-success/20 text-success border-success/30' },
  cancelled: { label: 'Cancelada', className: 'bg-muted text-muted-foreground' },
};

const serviceTypeConfig = {
  installation: { label: 'Instalação', className: 'bg-primary/10 text-primary' },
  maintenance: { label: 'Manutenção', className: 'bg-warning/10 text-warning' },
  repair: { label: 'Reparo', className: 'bg-destructive/10 text-destructive' },
};

const priorityConfig = {
  normal: { label: 'Normal', className: 'bg-muted text-muted-foreground' },
  high: { label: 'Alta', className: 'bg-warning/20 text-warning' },
  urgent: { label: 'Urgente', className: 'bg-destructive/20 text-destructive' },
};

export function ServiceOrderList() {
  const { data: orders, isLoading } = useServiceOrders();
  const deleteOrder = useDeleteServiceOrder();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders?.filter(order => 
    (order.order_number || '').toLowerCase().includes(search.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    order.customer_address.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (order: any) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedOrder(null);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="border rounded-lg">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b last:border-b-0">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar OS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreate} className="gradient-primary w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nova OS
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>OS / Cliente</TableHead>
              <TableHead>Tipo / Prioridade</TableHead>
              <TableHead>Técnico</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma OS encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders?.map((order) => {
                const status = statusConfig[order.status];
                const type = serviceTypeConfig[order.service_type];
                const priority = priorityConfig[order.priority];
                
                return (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-mono font-medium text-sm">{order.order_number}</p>
                        <p className="font-medium">{order.customer_name}</p>
                        {order.customer_phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {order.customer_phone}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{order.customer_address}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Badge variant="outline" className={type.className}>
                          {type.label}
                        </Badge>
                        <Badge variant="outline" className={priority.className}>
                          {priority.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.technicians ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{order.technicians.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Não atribuído</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(order.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(order)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => deleteOrder.mutate(order.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ServiceOrderDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
}
