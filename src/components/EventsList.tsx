
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { FootballEvent } from "@/types";
import { formatDate } from "@/lib/utils";

interface EventsListProps {
  events: FootballEvent[];
  emptyMessage?: string;
}

const EventsList: React.FC<EventsListProps> = ({ 
  events,
  emptyMessage = "Você ainda não tem eventos criados."
}) => {
  if (events.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/30 rounded-lg animate-fade-in">
        <p className="text-muted-foreground">{emptyMessage}</p>
        <Button asChild className="mt-4 bg-fut-600 hover:bg-fut-700">
          <Link to="/create-event">Criar novo evento</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-fut-800">{event.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.date)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-start gap-2 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>{event.players.length} / {event.maxPlayers} jogadores</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex gap-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to={`/event/${event.id}`}>Detalhes</Link>
            </Button>
            <Button size="sm" className="w-full bg-fut-600 hover:bg-fut-700" asChild>
              <Link to={`/event/${event.id}/share`}>Compartilhar</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default EventsList;
