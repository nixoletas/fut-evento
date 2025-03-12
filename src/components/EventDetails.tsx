
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Info } from "lucide-react";
import { FootballEvent } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";

interface EventDetailsProps {
  event: FootballEvent;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  return (
    <Card className="w-full glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-fut-800">{event.title}</CardTitle>
        <CardDescription>
          Detalhes do evento
        </CardDescription>
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
            <p className="font-medium">{event.players.length} confirmados de {event.maxPlayers} vagas</p>
          </div>
        </div>

        {event.description && (
          <div className="flex gap-3 p-3 bg-white/50 rounded-lg border border-border">
            <Info className="h-5 w-5 text-fut-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Detalhes adicionais</p>
              <p className="font-medium whitespace-pre-line">{event.description}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventDetails;
