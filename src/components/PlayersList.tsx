import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Clipboard, CheckCircle, XCircle } from "lucide-react";
import { FootballEvent, Player } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { useEvents } from "@/providers/EventsProvider";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatTime } from "@/lib/utils";

interface PlayersListProps {
  event: FootballEvent;
  isCreator?: boolean;
}

const PlayersList: React.FC<PlayersListProps> = ({
  event,
  isCreator = false,
}) => {
  const { user } = useAuth();
  const { removePlayerFromEvent } = useEvents();
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  // Sort players by position
  const sortedPlayers = [...(event.players || [])].sort(
    (a, b) => a.position - b.position
  );

  const handleCopyList = () => {
    // Create list with confirmed players
    const playersList = sortedPlayers.map(
      (player, index) => `${index + 1} - ${player.name}`
    );

    // Add empty spots up to max_players
    for (let i = sortedPlayers.length + 1; i <= event.max_players; i++) {
      playersList.push(`${i} - `);
    }

    const fullText = `⚽ ${event.title}\n📆 ${formatDate(
      event.date
    )}-${formatTime(
      new Date(event.date.getTime() + event.duration_min * 60000)
    )}\n📍 ${event.location}:\n\n${playersList.join("\n")}`;

    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        setCopied(true);
        toast({
          title: "Lista copiada!",
          description:
            "A lista de jogadores foi copiada para sua área de transferência",
        });

        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast({
          title: "Erro",
          description: "Não foi possível copiar a lista. Tente novamente.",
          variant: "destructive",
        });
      });
  };

  const handleRemovePlayer = async (playerId: string) => {
    try {
      await removePlayerFromEvent(event.id, playerId);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o jogador. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full glass-card animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl text-fut-800">
          Jogadores ({sortedPlayers.length}/{event.max_players})
        </CardTitle>
        {isCreator && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleCopyList}
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4" />
                <span>Copiar Lista</span>
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="list-container overflow-y-auto max-h-[300px] pr-2">
          {sortedPlayers.length === 0 ? (
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                Nenhum jogador confirmado ainda
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {sortedPlayers.map((player) => (
                <PlayerItem
                  key={player.id}
                  player={player}
                  isCreator={isCreator}
                  onRemove={() => handleRemovePlayer(player.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface PlayerItemProps {
  player: Player;
  isCreator: boolean;
  onRemove: () => void;
}

const PlayerItem: React.FC<PlayerItemProps> = ({
  player,
  isCreator,
  onRemove,
}) => {
  return (
    <li className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-fut-600 flex items-center justify-center text-white text-sm">
          {player.position}
        </div>
        <span className="font-medium">{player.name}</span>
      </div>

      {isCreator && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      )}
    </li>
  );
};

export default PlayersList;
