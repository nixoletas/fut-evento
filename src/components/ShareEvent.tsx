import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Copy, CheckCircle, Share2 } from "lucide-react";
import { FootballEvent } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface ShareEventProps {
  event: FootballEvent;
}

const ShareEvent: React.FC<ShareEventProps> = ({ event }) => {
  const { toast } = useToast();
  const [linkCopied, setLinkCopied] = useState(false);
  const [whatsappCopied, setWhatsappCopied] = useState(false);

  const eventLink = `${window.location.origin}/join/${event.id}`;

  const whatsappMessage = encodeURIComponent(
    `Olá! Estou organizando um futebol e gostaria de convidar você:\n\n${
      event.title
    }\n📅 ${new Date(event.date).toLocaleDateString("pt-BR")}, ${new Date(
      event.date
    ).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}\n📍 ${
      event.location
    }\n\nClique no link abaixo para confirmar sua presença:\n${eventLink}`
  );

  const whatsappLink = `https://wa.me/?text=${whatsappMessage}`;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(eventLink)
      .then(() => {
        setLinkCopied(true);
        toast({
          title: "Link copiado!",
          description:
            "O link do evento foi copiado para sua área de transferência",
        });

        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(() => {
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link. Tente novamente.",
          variant: "destructive",
        });
      });
  };

  const handleShareWhatsApp = () => {
    window.open(whatsappLink, "_blank");
  };

  const handleCopyWhatsAppMessage = () => {
    const decodedMessage = decodeURIComponent(whatsappMessage);
    navigator.clipboard
      .writeText(decodedMessage)
      .then(() => {
        setWhatsappCopied(true);
        toast({
          title: "Mensagem copiada!",
          description: "A mensagem foi copiada para sua área de transferência",
        });

        setTimeout(() => setWhatsappCopied(false), 2000);
      })
      .catch(() => {
        toast({
          title: "Erro",
          description: "Não foi possível copiar a mensagem. Tente novamente.",
          variant: "destructive",
        });
      });
  };

  return (
    <Card className="w-full glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl text-fut-800">
          Compartilhar Evento
        </CardTitle>
        <CardDescription>
          Compartilhe o link do evento com seus amigos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Link do evento</label>
          <div className="flex gap-2">
            <Input readOnly value={eventLink} className="bg-white/50 flex-1" />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              className="flex-shrink-0"
            >
              {linkCopied ? (
                <CheckCircle className="h-4 w-4 text-fut-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            className="w-full bg-fut-600 hover:bg-fut-700"
            onClick={handleShareWhatsApp}
          >
            <Share className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleCopyWhatsAppMessage}
          >
            {whatsappCopied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2 text-fut-600" />
                Link Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </>
            )}
          </Button>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg mt-4">
          <h4 className="font-medium mb-2">Link de inscrição</h4>
          <p className="text-sm text-muted-foreground">
            Este link permite que qualquer pessoa adicione seu nome ao evento
            sem precisar de conta.
            <br />
            Você pode acompanhar a lista atualizada a qualquer momento.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShareEvent;
