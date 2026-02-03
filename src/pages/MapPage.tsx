import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTechnicians } from '@/hooks/useTechnicians';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, User } from 'lucide-react';

const statusConfig = {
  available: { label: 'Disponível', className: 'bg-success text-success-foreground' },
  busy: { label: 'Em Atendimento', className: 'bg-warning text-warning-foreground' },
  offline: { label: 'Offline', className: 'bg-muted text-muted-foreground' },
};

export default function MapPage() {
  const { data: technicians } = useTechnicians();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Mapa</h1>
        <p className="text-muted-foreground">Visualize a localização dos técnicos em tempo real</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map placeholder */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="h-[500px] bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">
                  Integração com Google Maps
                </p>
                <p className="text-sm text-muted-foreground">
                  Para habilitar o mapa, configure a API Key do Google Maps
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technicians list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Técnicos no Mapa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {technicians?.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                Nenhum técnico cadastrado
              </p>
            ) : (
              technicians?.map((tech) => {
                const status = statusConfig[tech.status];
                return (
                  <div key={tech.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{tech.name}</p>
                        <Badge className={`${status.className} flex-shrink-0`}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {tech.phone}
                      </div>
                      {tech.current_address && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{tech.current_address}</span>
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
