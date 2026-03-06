import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, User, Navigation } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Technician = Database['public']['Tables']['technicians']['Row'];

const statusConfig = {
  available: { label: 'Disponível', color: 'hsl(120, 60%, 40%)', bg: 'bg-success' },
  busy: { label: 'Em Atendimento', color: 'hsl(48, 100%, 50%)', bg: 'bg-warning' },
  offline: { label: 'Offline', color: 'hsl(0, 0%, 40%)', bg: 'bg-muted-foreground' },
};

interface SimpleMapProps {
  technicians: Technician[];
}

// Map bounds for São Paulo area
const MAP_BOUNDS = {
  minLat: -23.62,
  maxLat: -23.50,
  minLng: -46.72,
  maxLng: -46.60,
};

function latToY(lat: number): number {
  return ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
}

function lngToX(lng: number): number {
  return ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
}

export function SimpleMap({ technicians }: SimpleMapProps) {
  const [selected, setSelected] = useState<Technician | null>(null);

  const techsWithLocation = technicians.filter(
    t => t.current_location_lat && t.current_location_lng
  );

  return (
    <div className="relative w-full h-[500px] bg-card rounded-lg border border-border overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div key={`h${i}`} className="absolute w-full border-t border-foreground/20" style={{ top: `${i * 5}%` }} />
        ))}
        {[...Array(20)].map((_, i) => (
          <div key={`v${i}`} className="absolute h-full border-l border-foreground/20" style={{ left: `${i * 5}%` }} />
        ))}
      </div>

      {/* Map label */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-card/90 backdrop-blur px-3 py-1.5 rounded-lg border border-border/50">
        <Navigation className="h-4 w-4 text-primary" />
        <span className="text-xs font-mono text-primary">São Paulo - SP</span>
      </div>

      {/* Legend */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 bg-card/90 backdrop-blur px-3 py-2 rounded-lg border border-border/50">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2 text-[10px]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
            <span className="text-muted-foreground">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Street names */}
      <div className="absolute top-[20%] left-[15%] text-[9px] text-muted-foreground/30 font-mono rotate-[-15deg]">Av. Paulista</div>
      <div className="absolute top-[45%] left-[60%] text-[9px] text-muted-foreground/30 font-mono rotate-[-5deg]">Av. Faria Lima</div>
      <div className="absolute top-[70%] left-[30%] text-[9px] text-muted-foreground/30 font-mono rotate-[10deg]">Av. Ibirapuera</div>
      <div className="absolute top-[35%] left-[35%] text-[9px] text-muted-foreground/30 font-mono rotate-[-8deg]">Rua Augusta</div>

      {/* Technician markers */}
      {techsWithLocation.map((tech) => {
        const x = lngToX(tech.current_location_lng!);
        const y = 100 - latToY(tech.current_location_lat!);
        const status = statusConfig[tech.status];
        const isSelected = selected?.id === tech.id;

        return (
          <div
            key={tech.id}
            className="absolute z-20 cursor-pointer group"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={() => setSelected(isSelected ? null : tech)}
          >
            {/* Pulse animation for available */}
            {tech.status === 'available' && (
              <div
                className="absolute w-6 h-6 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: status.color, left: '-3px', top: '-3px' }}
              />
            )}
            {/* Dot */}
            <div
              className="w-5 h-5 rounded-full border-2 border-background shadow-lg transition-transform"
              style={{
                backgroundColor: status.color,
                transform: isSelected ? 'scale(1.4)' : 'scale(1)',
                boxShadow: `0 0 8px ${status.color}`,
              }}
            />
            {/* Name tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap bg-card border border-border px-2 py-1 rounded text-[10px] text-foreground shadow-xl">
              {tech.name}
            </div>
          </div>
        );
      })}

      {/* Selected tech info */}
      {selected && (
        <div className="absolute bottom-3 left-3 right-3 z-30 bg-card/95 backdrop-blur border border-border rounded-lg p-4 shadow-xl animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">{selected.name}</p>
                <Badge className={`text-[10px] ${statusConfig[selected.status].bg}`}>
                  {statusConfig[selected.status].label}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {selected.phone}
                </div>
                {selected.current_address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{selected.current_address}</span>
                  </div>
                )}
                {selected.email && (
                  <div className="flex items-center gap-1 text-primary/70">
                    {selected.email}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSelected(null); }}
              className="text-muted-foreground hover:text-foreground text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Stats overlay */}
      <div className="absolute bottom-3 right-3 z-10 bg-card/90 backdrop-blur px-3 py-2 rounded-lg border border-border/50 text-[10px] font-mono">
        <span className="text-primary font-bold">{techsWithLocation.length}</span>
        <span className="text-muted-foreground"> técnicos rastreados</span>
      </div>
    </div>
  );
}
