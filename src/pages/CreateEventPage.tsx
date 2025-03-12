
import React from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import EventForm from "@/components/EventForm";
import { useAuth } from "@/providers/AuthProvider";

const CreateEventPage: React.FC = () => {
  const { user, loading } = useAuth();

  // Redirect if not logged in
  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-fut-50">
      <Header />
      
      <div className="flex-1 flex flex-col items-center p-4 pt-20 max-w-6xl mx-auto w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-fut-800">Criar Evento</h1>
          <p className="text-muted-foreground mt-1">
            Defina os detalhes do seu evento de futebol
          </p>
        </div>
        
        <div className="w-full">
          <EventForm />
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
