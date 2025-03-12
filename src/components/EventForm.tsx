
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvents } from "@/providers/EventsProvider";
import { useToast } from "@/hooks/use-toast";

const EventForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createEvent } = useEvents();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !time || !location) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const combinedDateTime = new Date(`${date}T${time}`);
    if (isNaN(combinedDateTime.getTime())) {
      toast({
        title: "Erro",
        description: "Data ou hora inválida",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newEvent = await createEvent({
        title,
        date: combinedDateTime,
        location,
        max_players: maxPlayers,
        description
      });
      
      navigate(`/event/${newEvent.id}/share`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-fut-800">Criar Novo Evento</CardTitle>
        <CardDescription className="text-center">
          Preencha os detalhes do seu evento de futebol
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Evento*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fut de Quarta"
              className="bg-white/50"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data*</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horário*</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-white/50"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Local*</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Quadra do Parque Central"
              className="bg-white/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Número Máximo de Jogadores*</Label>
            <Input
              id="maxPlayers"
              type="number"
              min={2}
              max={100}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
              className="bg-white/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Informações adicionais, como o que levar, preço, etc."
              className="bg-white/50 min-h-[100px]"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-fut-600 hover:bg-fut-700" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Criando evento..." : "Criar Evento"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="link" onClick={() => navigate("/dashboard")}>
          Cancelar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventForm;
