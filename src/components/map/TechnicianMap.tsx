import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import { User, Phone, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Database } from '@/integrations/supabase/types';

type Technician = Database['public']['Tables']['technicians']['Row'];

const statusConfig = {
  available: { label: 'Disponível', color: '#22c55e' },
  busy: { label: 'Em Atendimento', color: '#f59e0b' },
  offline: { label: 'Offline', color: '#6b7280' },
};

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem',
};

const defaultCenter = {
  lat: -23.5505,
  lng: -46.6333,
};

interface TechnicianMapProps {
  technicians: Technician[];
}

export function TechnicianMap({ technicians }: TechnicianMapProps) {
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Fit bounds to show all technicians
    const techniciansWithLocation = technicians.filter(
      (t) => t.current_location_lat && t.current_location_lng
    );
    
    if (techniciansWithLocation.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      techniciansWithLocation.forEach((tech) => {
        bounds.extend({
          lat: tech.current_location_lat!,
          lng: tech.current_location_lng!,
        });
      });
      map.fitBounds(bounds);
    }
  }, [technicians]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!apiKey) {
    return (
      <div className="h-[500px] bg-muted/30 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Integração com Google Maps
          </p>
          <p className="text-sm text-muted-foreground">
            Configure a variável VITE_GOOGLE_MAPS_API_KEY para habilitar o mapa
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-[500px] bg-destructive/10 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <MapPin className="h-12 w-12 text-destructive mx-auto" />
          <p className="text-destructive font-medium">Erro ao carregar o mapa</p>
          <p className="text-sm text-muted-foreground">
            Verifique se a API Key do Google Maps está configurada corretamente
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[500px] bg-muted/30 rounded-lg flex items-center justify-center animate-pulse">
        <div className="text-center space-y-2">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto animate-bounce" />
          <p className="text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  const techniciansWithLocation = technicians.filter(
    (t) => t.current_location_lat && t.current_location_lng
  );

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        zoomControl: true,
      }}
    >
      {techniciansWithLocation.map((tech) => {
        const status = statusConfig[tech.status];
        return (
          <Marker
            key={tech.id}
            position={{
              lat: tech.current_location_lat!,
              lng: tech.current_location_lng!,
            }}
            onClick={() => setSelectedTechnician(tech)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: status.color,
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            }}
          />
        );
      })}

      {selectedTechnician && selectedTechnician.current_location_lat && selectedTechnician.current_location_lng && (
        <InfoWindow
          position={{
            lat: selectedTechnician.current_location_lat,
            lng: selectedTechnician.current_location_lng,
          }}
          onCloseClick={() => setSelectedTechnician(null)}
        >
          <div className="p-2 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedTechnician.name}</p>
                <span 
                  className="text-xs px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: statusConfig[selectedTechnician.status].color }}
                >
                  {statusConfig[selectedTechnician.status].label}
                </span>
              </div>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {selectedTechnician.phone}
              </div>
              {selectedTechnician.current_address && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-2">{selectedTechnician.current_address}</span>
                </div>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
