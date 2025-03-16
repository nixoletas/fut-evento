import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Info, Trash2 } from "lucide-react";
import { FootballEvent } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";

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
  return (
    <Card className="w-full glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-fut-800">
          Detalhes do Evento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border">
            <Calendar className="h-5 w-5 text-fut-600" />
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium">{formatDate(event.date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border">
            <Clock className="h-5 w-5 text-fut-600" />
            <div>
              <p className="text-sm text-muted-foreground">Horário</p>
              <p className="font-medium">{formatTime(event.date)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border">
          <MapPin className="h-5 w-5 text-fut-600" />
          <div>
            <p className="text-sm text-muted-foreground">Local</p>
            <p className="font-medium">{event.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border">
          <Users className="h-5 w-5 text-fut-600" />
          <div>
            <p className="text-sm text-muted-foreground">Vagas</p>
            <p className="font-medium">
              {event.players.length} confirmados de {event.max_players} vagas
            </p>
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
