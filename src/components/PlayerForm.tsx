import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEvents } from "@/providers/EventsProvider";
import { FootballEvent } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const isFull = event.players.length >= event.max_players;

  return (
    <Card className="w-full glass-card animate-fade-in border-2 border-fut-600 shadow-lg shadow-fut-100">
      <CardHeader className="pb-3 bg-fut-50 rounded-t-lg border-b border-fut-200">
        <CardTitle className="text-xl text-fut-800 flex justify-center flex-col items-center gap-2">
          <span className="bg-fut-600 text-white p-1 rounded-md text-sm">
            {isFull ? "LISTA CHEIA" : "PARTICIPE"}
          </span>
          Adicionar seu nome à lista
        </CardTitle>
        <CardDescription className="font-medium">
          {isFull
            ? `Lista cheia (${event.players.length}/${event.max_players})`
            : `Vagas disponíveis: ${
                event.max_players - event.players.length
              } de ${event.max_players}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="playerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className="bg-white/80 border-2 border-fut-200 h-12 text-lg placeholder:text-fut-400"
              disabled={isFull || isSubmitting}
              required
            />
          </div>
          <Button
            type="submit"
            className={`w-full h-12 text-lg font-medium transition-all duration-200 ${
              isFull
                ? "bg-gray-400 hover:bg-gray-500"
                : "bg-fut-600 hover:bg-fut-700 hover:scale-[1.02] active:scale-[0.98]"
            }`}
            disabled={isFull || isSubmitting || !name.trim()}
          >
            {isSubmitting
              ? "Adicionando..."
              : isFull
              ? "Lista Completa"
              : "Confirmar Presença"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerForm;
