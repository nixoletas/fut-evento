import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Info,
  Trash2,
  Navigation,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { FootballEvent } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useEvents } from "@/providers/EventsProvider";
import { useAuth } from "@/providers/AuthProvider";

interface EventDetailsProps {
  event: FootballEvent;
  onDelete?: (eventId: string) => void;
  showDeleteButton?: boolean;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onDelete,
  showDeleteButton = false,
}) => {
  const { user } = useAuth();
  const { updateEvent } = useEvents();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMaxPlayers, setEditedMaxPlayers] = useState(event.max_players);
  const [editedDate, setEditedDate] = useState(
    event.date.toISOString().split("T")[0]
  );
  const [editedTime, setEditedTime] = useState(formatTime(event.date));
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const isCreator = user?.id === event.created_by;

  useEffect(() => {
    if (
      mapRef.current &&
      !googleMapRef.current &&
      event.location_lat &&
      event.location_lng &&
      window.google?.maps
    ) {
      const location = { lat: event.location_lat, lng: event.location_lng };

      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: location,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      markerRef.current = new window.google.maps.Marker({
        position: location,
        map: googleMapRef.current,
        animation: window.google.maps.Animation.DROP,
      });
    }
  }, [event.location_lat, event.location_lng]);

  const handleOpenMaps = () => {
    if (event.location_lat && event.location_lng) {
      const url = `https://www.google.com/maps/search/?api=1&query=${event.location_lat},${event.location_lng}`;
      window.open(url, "_blank");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const [hours, minutes] = editedTime.split(":");
      const newDate = new Date(editedDate);
      newDate.setHours(parseInt(hours), parseInt(minutes));

      await updateEvent(event.id, {
        max_players: editedMaxPlayers,
        date: newDate,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditedMaxPlayers(event.max_players);
    setEditedDate(event.date.toISOString().split("T")[0]);
    setEditedTime(formatTime(event.date));
    setIsEditing(false);
  };

  return (
    <Card className="w-full glass-card animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-fut-800">
          Detalhes do Evento
        </CardTitle>
        {isCreator && !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-fut-600 hover:text-fut-700"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        {isEditing && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveChanges}
              className="text-green-600 hover:text-green-700"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border">
            <Calendar className="h-5 w-5 text-fut-600" />
            <div className="flex-1">
              {isEditing ? (
                <Input
                  type="date"
                  value={editedDate}
                  onChange={(e) => setEditedDate(e.target.value)}
                  className="max-w-[200px]"
                />
              ) : (
                <p className="font-medium">{formatDate(event.date)}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border">
            <Clock className="h-5 w-5 text-fut-600" />
            <div className="flex-1">
              {isEditing ? (
                <Input
                  type="time"
                  value={editedTime}
                  onChange={(e) => setEditedTime(e.target.value)}
                  className="max-w-[200px]"
                />
              ) : (
                <p className="font-medium">{formatTime(event.date)}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border">
            <MapPin className="h-5 w-5 text-fut-600" />
            <div>
              <p className="text-sm text-muted-foreground">Local</p>
              <p className="font-medium">{event.location}</p>
            </div>
          </div>

          {event.location_lat && event.location_lng && (
            <div className="relative">
              <div
                ref={mapRef}
                className="w-full h-[200px] rounded-lg overflow-hidden border border-input bg-white/50"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-4 right-4 shadow-md"
                onClick={handleOpenMaps}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Abrir no Maps
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border">
          <Users className="h-5 w-5 text-fut-600" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Vagas</p>
            {isEditing ? (
              <Input
                type="number"
                min={event.players.length}
                value={editedMaxPlayers}
                onChange={(e) => setEditedMaxPlayers(parseInt(e.target.value))}
                className="max-w-[100px]"
              />
            ) : (
              <p className="font-medium">
                {event.players.length} confirmados de {event.max_players} vagas
              </p>
            )}
          </div>
        </div>

        {event.description && (
          <div className="flex gap-3 p-3 bg-white/50 rounded-lg border border-border">
            <Info className="h-5 w-5 text-fut-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">
                Detalhes adicionais
              </p>
              <p className="font-medium whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      {showDeleteButton && onDelete && (
        <CardFooter className="pt-2">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => onDelete(event.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Evento
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default EventDetails;
