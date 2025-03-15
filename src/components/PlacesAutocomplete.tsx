import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlacesAutocompleteProps {
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  defaultValue?: string;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onLocationSelect,
  defaultValue = "",
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["establishment", "geocode"],
      componentRestrictions: { country: "BR" },
    },
    defaultValue,
  });

  useEffect(() => {
    if (mapRef.current && !googleMapRef.current) {
      // Default to São Paulo coordinates if no location selected
      const defaultLocation = { lat: -23.5505, lng: -46.6333 };

      googleMapRef.current = new google.maps.Map(mapRef.current, {
        zoom: 15,
        center: selectedLocation || defaultLocation,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
    }
  }, [ready]);

  useEffect(() => {
    if (selectedLocation && googleMapRef.current) {
      googleMapRef.current.setCenter(selectedLocation);

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = new google.maps.Marker({
        position: selectedLocation,
        map: googleMapRef.current,
        animation: google.maps.Animation.DROP,
      });
    }
  }, [selectedLocation]);

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    setOpen(false);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setSelectedLocation({ lat, lng });
      onLocationSelect({ address, lat, lng });
    } catch (error) {
      console.error("Error: ", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível obter as coordenadas do local selecionado.",
        variant: "destructive",
      });
    }
  };

  if (!ready) {
    return (
      <div className="space-y-2">
        <Label htmlFor="location">Local*</Label>
        <div className="relative">
          <Input
            disabled
            placeholder="Carregando serviço de busca..."
            className="bg-white/50"
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location">Local*</Label>
        <div className="relative">
          <Input
            id="location"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Busque um local..."
            className="bg-white/50"
            required
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div
        ref={mapRef}
        className="w-full h-[300px] rounded-lg overflow-hidden border border-input bg-white/50"
      />

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Busque um local..."
          value={value}
          onValueChange={setValue}
        />
        <CommandList>
          <CommandEmpty>Nenhum local encontrado.</CommandEmpty>
          <CommandGroup>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <CommandItem
                  key={place_id}
                  value={description}
                  onSelect={handleSelect}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {description}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default PlacesAutocomplete;
