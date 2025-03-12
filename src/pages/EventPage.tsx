
import React from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import EventDetails from "@/components/EventDetails";
import PlayersList from "@/components/PlayersList";
import ShareEvent from "@/components/ShareEvent";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useEvents } from "@/providers/EventsProvider";
import { useAuth } from "@/providers/AuthProvider";

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEvent, loading } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();

  const event = id ? getEvent(id) : undefined;
  const isCreator = user && event ? user.id === event.created_by : false;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-fut-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="p-4 rounded-lg bg-white shadow animate-pulse-subtle">
            Carregando evento...
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-fut-50">
      <Header />
      
      <div className="flex-1 flex flex-col p-4 pt-20 max-w-6xl mx-auto w-full">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1 mb-2"
            onClick={() => navigate("/dashboard")}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          
          <h1 className="text-3xl font-bold text-fut-800">{event.title}</h1>
          <p className="text-muted-foreground mt-1">
            Detalhes e participantes
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EventDetails event={event} />
            <PlayersList event={event} isCreator={isCreator} />
          </div>
          
          <div className="space-y-6">
            <ShareEvent event={event} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
