import React, { createContext, useContext, useState, useEffect } from "react";
import { FootballEvent, Player } from "@/types";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EventsContextType {
  events: FootballEvent[];
  loading: boolean;
  createEvent: (
    eventData: Omit<
      FootballEvent,
      "id" | "created_by" | "created_at" | "players"
    >
  ) => Promise<FootballEvent>;
  updateEvent: (
    eventId: string,
    eventData: Partial<Pick<FootballEvent, "max_players" | "date">>
  ) => Promise<void>;
  getEvent: (id: string) => FootballEvent | undefined;
  addPlayerToEvent: (eventId: string, playerName: string) => Promise<void>;
  removePlayerFromEvent: (eventId: string, playerId: string) => Promise<void>;
  updatePlayerPosition: (
    eventId: string,
    playerId: string,
    newPosition: number
  ) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<FootballEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch events from Supabase
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Get all events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*");

      if (eventsError) {
        throw eventsError;
      }

      // Get all players
      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .select("*");

      if (playersError) {
        throw playersError;
      }

      // Process events data
      const processedEvents = eventsData.map((event: any) => {
        // Find players belonging to this event
        const eventPlayers = playersData
          .filter((player: any) => player.event_id === event.id)
          .map((player: any) => ({
            ...player,
            added_at: new Date(player.added_at),
          }));

        return {
          ...event,
          date: new Date(event.date),
          created_at: new Date(event.created_at),
          players: eventPlayers,
        };
      });

      setEvents(processedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os eventos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Subscribe to changes
    const eventsSubscription = supabase
      .channel("events_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    const playersSubscription = supabase
      .channel("players_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      eventsSubscription.unsubscribe();
      playersSubscription.unsubscribe();
    };
  }, []);

  const createEvent = async (
    eventData: Omit<
      FootballEvent,
      "id" | "created_by" | "created_at" | "players"
    >
  ) => {
    if (!user) {
      throw new Error("User must be logged in to create an event");
    }

    // Insert event into Supabase
    const { data, error } = await supabase
      .from("events")
      .insert({
        title: eventData.title,
        date: eventData.date.toISOString(),
        location: eventData.location,
        location_lat: eventData.location_lat,
        location_lng: eventData.location_lng,
        max_players: eventData.max_players,
        description: eventData.description,
        created_by: user.id,
        duration_min: eventData.duration_min,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }

    const newEvent: FootballEvent = {
      ...data,
      date: new Date(data.date),
      created_at: new Date(data.created_at),
      players: [],
      duration_min: eventData.duration_min,
    };

    setEvents((prev) => [...prev, newEvent]);

    toast({
      title: "Evento criado com sucesso!",
      description: "Compartilhe o link com seus amigos.",
    });

    return newEvent;
  };

  const getEvent = (id: string) => {
    return events.find((event) => event.id === id);
  };

  const addPlayerToEvent = async (eventId: string, playerName: string) => {
    // Get the event to check player positions
    const event = getEvent(eventId);
    if (!event) {
      throw new Error("Evento não encontrado");
    }

    // Get the next available position
    const positions = event.players?.map((p) => p.position) || [];
    let nextPosition = 1;
    while (positions.includes(nextPosition)) {
      nextPosition++;
    }

    // Insert player into Supabase
    const { error } = await supabase.from("players").insert({
      name: playerName,
      position: nextPosition,
      event_id: eventId,
    });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o jogador. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Nome adicionado!",
      description: "Você foi adicionado à lista.",
    });

    // Refresh events data after adding player
    await fetchEvents();
  };

  const removePlayerFromEvent = async (eventId: string, playerId: string) => {
    // Delete player from Supabase
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", playerId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o jogador. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Jogador removido",
      description: "O jogador foi removido da lista.",
    });

    // Refresh events data after removing player
    await fetchEvents();
  };

  const updatePlayerPosition = async (
    eventId: string,
    playerId: string,
    newPosition: number
  ) => {
    // Get the event to check player positions
    const event = getEvent(eventId);
    if (!event) {
      throw new Error("Evento não encontrado");
    }

    // Check if the position is already taken
    const positionTaken = event.players?.some(
      (p) => p.id !== playerId && p.position === newPosition
    );
    if (positionTaken) {
      throw new Error("Esta posição já está ocupada");
    }

    // Update player position in Supabase
    const { error } = await supabase
      .from("players")
      .update({ position: newPosition })
      .eq("id", playerId);

    if (error) {
      toast({
        title: "Erro",
        description:
          "Não foi possível atualizar a posição do jogador. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }

    // Refresh events data after updating player position
    await fetchEvents();
  };

  const deleteEvent = async (eventId: string) => {
    try {
      // First delete all players associated with the event
      const { error: playersDeleteError } = await supabase
        .from("players")
        .delete()
        .eq("event_id", eventId);

      if (playersDeleteError) {
        toast({
          title: "Erro",
          description:
            "Não foi possível remover os jogadores do evento. Tente novamente.",
          variant: "destructive",
        });
        throw playersDeleteError;
      }

      // Then delete the event itself
      const { error: eventDeleteError } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (eventDeleteError) {
        toast({
          title: "Erro",
          description: "Não foi possível remover o evento. Tente novamente.",
          variant: "destructive",
        });
        throw eventDeleteError;
      }

      toast({
        title: "Evento removido",
        description:
          "O evento e todos os jogadores foram removidos com sucesso.",
      });

      // Refresh events data after deleting event and players
      await fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };

  const updateEvent = async (
    eventId: string,
    eventData: Partial<Pick<FootballEvent, "max_players" | "date">>
  ) => {
    if (!user) {
      throw new Error("User must be logged in to update an event");
    }

    const event = getEvent(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is the creator
    if (event.created_by !== user.id) {
      throw new Error("Only the event creator can update the event");
    }

    // Prepare update data
    const updateData: Record<string, any> = {};
    if (eventData.max_players !== undefined) {
      // Ensure new max_players is not less than current players
      if (eventData.max_players < event.players.length) {
        throw new Error(
          "Não é possível reduzir o número de vagas abaixo do número de jogadores confirmados"
        );
      }
      updateData.max_players = eventData.max_players;
    }
    if (eventData.date !== undefined) {
      updateData.date = eventData.date.toISOString();
    }

    // Update event in Supabase
    const { error } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", eventId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o evento. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Evento atualizado",
      description: "As alterações foram salvas com sucesso.",
    });

    // Refresh events data
    await fetchEvents();
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        loading,
        createEvent,
        updateEvent,
        getEvent,
        addPlayerToEvent,
        removePlayerFromEvent,
        updatePlayerPosition,
        deleteEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
