import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTechnicians } from '@/hooks/useTechnicians';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, User, RefreshCw } from 'lucide-react';
import { SimpleMap } from '@/components/map/SimpleMap';
import { Button } from '@/components/ui/button';

const statusConfig = {
  available: { label: 'Disponível', className: 'bg-success text-success-foreground' },
  busy: { label: 'Em Atendimento', className: 'bg-warning text-warning-foreground' },
  offline: { label: 'Offline', className: 'bg-muted text-muted-foreground' },
};

export default function MapPage() {
  const { data: technicians, refetch, isRefetching } = useTechnicians();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mapa de Deslocamento</h1>
          <p className="text-muted-foreground">Visualize a localização dos técnicos em tempo real</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50">
          <CardContent className="p-0 overflow-hidden rounded-lg">
            <SimpleMap technicians={technicians || []} />
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Técnicos no Mapa
              <Badge variant="secondary" className="font-mono">
                {technicians?.filter(t => t.current_location_lat && t.current_location_lng).length || 0} rastreados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[440px] overflow-y-auto">
            {technicians?.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                Nenhum técnico cadastrado
              </p>
            ) : (
              technicians?.map((tech) => {
                const status = statusConfig[tech.status];
                const hasLocation = tech.current_location_lat && tech.current_location_lng;
                return (
                  <div 
                    key={tech.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      hasLocation ? 'bg-muted/30 hover:bg-muted/50' : 'bg-muted/10 opacity-60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate text-sm">{tech.name}</p>
                        <Badge className={`${status.className} flex-shrink-0 text-[10px]`}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {tech.phone}
                      </div>
                      {tech.current_address ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 text-success" />
                          <span className="truncate">{tech.current_address}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="italic">Sem localização</span>
                        </div>
                      )}
                    </div>
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
