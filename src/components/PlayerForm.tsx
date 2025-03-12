
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEvents } from "@/providers/EventsProvider";
import { FootballEvent } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface PlayerFormProps {
  event: FootballEvent;
  onComplete?: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ event, onComplete }) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPlayerToEvent } = useEvents();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addPlayerToEvent(event.id, name.trim());
      setName("");
      if (onComplete) {
        onComplete();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFull = event.players.length >= event.maxPlayers;

  return (
    <Card className="w-full glass-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-fut-800">Adicionar seu nome à lista</CardTitle>
        <CardDescription>
          {isFull 
            ? `Lista cheia (${event.players.length}/${event.maxPlayers})`
            : `Vagas disponíveis: ${event.players.length}/${event.maxPlayers}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName">Seu Nome</Label>
            <Input
              id="playerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
              className="bg-white/50"
              disabled={isFull || isSubmitting}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-fut-600 hover:bg-fut-700" 
            disabled={isFull || isSubmitting || !name.trim()}
          >
            {isSubmitting ? "Adicionando..." : isFull ? "Lista Completa" : "Confirmar Presença"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerForm;
