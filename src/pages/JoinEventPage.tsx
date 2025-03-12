
import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import EventDetails from "@/components/EventDetails";
import PlayersList from "@/components/PlayersList";
import PlayerForm from "@/components/PlayerForm";
import { useEvents } from "@/providers/EventsProvider";

const JoinEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEvent, loading } = useEvents();
  const [formCompleted, setFormCompleted] = useState(false);

  const event = id ? getEvent(id) : undefined;

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
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-fut-800">{event.title}</h1>
          <p className="text-muted-foreground mt-1">
            Confirme sua presença preenchendo seu nome
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EventDetails event={event} />
            <PlayersList event={event} />
          </div>
          
          <div className="space-y-6">
            <PlayerForm 
              event={event} 
              onComplete={() => setFormCompleted(true)}
            />
            
            {formCompleted && (
              <div className="p-4 bg-fut-50 border border-fut-200 rounded-lg animate-slide-up">
                <h3 className="font-medium text-fut-800 mb-2">Confirmação recebida!</h3>
                <p className="text-sm text-muted-foreground">
                  Seu nome foi adicionado à lista de jogadores. Você pode verificar a lista atualizada nesta página.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinEventPage;
