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
  Phone, 
  MapPin, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Search,
  Plus,
  UserCircle
} from 'lucide-react';
import { useTechnicians, useDeleteTechnician } from '@/hooks/useTechnicians';
import { Skeleton } from '@/components/ui/skeleton';
import { TechnicianDialog } from './TechnicianDialog';

const statusConfig = {
  available: { label: 'Disponível', variant: 'default' as const, className: 'bg-success text-success-foreground' },
  busy: { label: 'Em Atendimento', variant: 'default' as const, className: 'bg-warning text-warning-foreground' },
  offline: { label: 'Offline', variant: 'secondary' as const, className: 'bg-muted text-muted-foreground' },
};

export function TechnicianList() {
  const { data: technicians, isLoading } = useTechnicians();
  const deleteTechnician = useDeleteTechnician();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);

  const filteredTechnicians = technicians?.filter(tech => 
    tech.name.toLowerCase().includes(search.toLowerCase()) ||
    tech.phone.toLowerCase().includes(search.toLowerCase()) ||
    tech.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (technician: any) => {
    setSelectedTechnician(technician);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedTechnician(null);
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
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
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
            placeholder="Buscar técnicos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreate} className="gradient-primary w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Técnico
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Técnico</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTechnicians?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum técnico encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredTechnicians?.map((technician) => {
                const status = statusConfig[technician.status];
                return (
                  <TableRow key={technician.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{technician.name}</p>
                          {technician.email && (
                            <p className="text-sm text-muted-foreground">{technician.email}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {technician.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      {technician.current_address ? (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">{technician.current_address}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.className}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(technician)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => deleteTechnician.mutate(technician.id)}
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

      <TechnicianDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        technician={selectedTechnician}
      />
    </div>
  );
}
