
import React, { createContext, useContext, useState, useEffect } from "react";
import { FootballEvent, Player } from "@/types";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface EventsContextType {
  events: FootballEvent[];
  loading: boolean;
  createEvent: (eventData: Omit<FootballEvent, "id" | "createdBy" | "createdAt" | "players">) => Promise<FootballEvent>;
  getEvent: (id: string) => FootballEvent | undefined;
  addPlayerToEvent: (eventId: string, playerName: string) => Promise<void>;
  removePlayerFromEvent: (eventId: string, playerId: string) => Promise<void>;
  updatePlayerPosition: (eventId: string, playerId: string, newPosition: number) => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<FootballEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load events from localStorage on initial load
    const savedEvents = localStorage.getItem("futEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      
      // Convert string dates back to Date objects
      const eventsWithDates = parsedEvents.map((event: any) => ({
        ...event,
        date: new Date(event.date),
        createdAt: new Date(event.createdAt),
        players: event.players.map((player: any) => ({
          ...player,
          addedAt: new Date(player.addedAt)
        }))
      }));
      
      setEvents(eventsWithDates);
    }
    setLoading(false);
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("futEvents", JSON.stringify(events));
    }
  }, [events]);

  const createEvent = async (eventData: Omit<FootballEvent, "id" | "createdBy" | "createdAt" | "players">) => {
    if (!user) {
      throw new Error("User must be logged in to create an event");
    }

    const newEvent: FootballEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdBy: user.id,
      createdAt: new Date(),
      players: []
    };

    setEvents(prev => [...prev, newEvent]);
    toast({
      title: "Evento criado com sucesso!",
      description: "Compartilhe o link com seus amigos."
    });
    
    return newEvent;
  };

  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };

  const addPlayerToEvent = async (eventId: string, playerName: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        // Get the next available position
        const positions = event.players.map(p => p.position);
        let nextPosition = 1;
        while (positions.includes(nextPosition)) {
          nextPosition++;
        }

        const newPlayer: Player = {
          id: Date.now().toString(),
          name: playerName,
          position: nextPosition,
          addedAt: new Date()
        };

        return {
          ...event,
          players: [...event.players, newPlayer]
        };
      }
      return event;
    }));

    toast({
      title: "Nome adicionado!",
      description: "Você foi adicionado à lista."
    });
  };

  const removePlayerFromEvent = async (eventId: string, playerId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          players: event.players.filter(p => p.id !== playerId)
        };
      }
      return event;
    }));

    toast({
      title: "Jogador removido",
      description: "O jogador foi removido da lista."
    });
  };

  const updatePlayerPosition = async (eventId: string, playerId: string, newPosition: number) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        // First, check if the position is already taken
        const positionTaken = event.players.some(p => p.id !== playerId && p.position === newPosition);
        if (positionTaken) {
          throw new Error("Esta posição já está ocupada");
        }

        return {
          ...event,
          players: event.players.map(p => 
            p.id === playerId ? { ...p, position: newPosition } : p
          )
        };
      }
      return event;
    }));
  };

  return (
    <EventsContext.Provider value={{ 
      events, 
      loading, 
      createEvent, 
      getEvent, 
      addPlayerToEvent, 
      removePlayerFromEvent,
      updatePlayerPosition
    }}>
      {children}
    </EventsContext.Provider>
  );
};
