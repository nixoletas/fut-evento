
import React from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import EventsList from "@/components/EventsList";
import { useAuth } from "@/providers/AuthProvider";
import { useEvents } from "@/providers/EventsProvider";

const DashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { events, loading: eventsLoading } = useEvents();

  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/login" replace />;
  }

  // Filter events created by the current user
  const userEvents = events.filter(event => event.created_by === user?.id);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-fut-50">
      <Header />
      
      <div className="flex-1 flex flex-col p-4 pt-20 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fut-800">Meus Eventos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os eventos que você criou
          </p>
        </div>
        
        {authLoading || eventsLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="p-4 rounded-lg bg-white shadow animate-pulse-subtle">
              Carregando eventos...
            </div>
          </div>
        ) : (
          <EventsList 
            events={userEvents}
            emptyMessage="Você ainda não criou nenhum evento. Crie um novo evento para começar."
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
