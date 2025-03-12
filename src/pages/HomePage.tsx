import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import {
  Calendar,
  ClipboardList,
  MapPin,
  Share,
  UserPlus,
  Users,
} from "lucide-react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="pt-20 pb-10 px-4 flex flex-col items-center justify-center text-center min-h-[90vh] bg-gradient-to-b from-white to-fut-50">
          <div className="animate-slide-up max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center bg-fut-100 text-fut-800 px-3 py-1 rounded-full mb-4">
              <span className="text-sm font-medium">
                Organize seu futebol com facilidade
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-fut-950 mb-6 leading-tight">
              Crie e gerencie eventos de futebol com a{" "}
              <span className="text-fut-600">Fut Evento</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Compartilhe um link, colete presenças sem complicação e tenha uma
              lista de jogadores organizada em segundos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-fut-600 hover:bg-fut-700 text-white shadow-lg"
                onClick={() => navigate("/register")}
              >
                Começar Agora
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-fut-200 text-fut-700"
                onClick={() => navigate("/login")}
              >
                Entrar
              </Button>
            </div>
          </div>

          {/* Visual illustration */}
          <div
            className="mt-16 relative w-full max-w-4xl mx-auto animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <div className="hidden sm:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fut-400/10 rounded-full blur-3xl -z-10"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
              <div className="glass-card p-5 rounded-xl shadow-sm border border-fut-200 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-fut-100 flex items-center justify-center mb-4">
                  <Calendar className="text-fut-600 h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-2">Crie Eventos</h3>
                <p className="text-sm text-muted-foreground">
                  Organize rapidamente seu jogo de futebol com todos os detalhes
                </p>
              </div>

              <div className="glass-card p-5 rounded-xl shadow-sm border border-fut-200 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-fut-100 flex items-center justify-center mb-4">
                  <Share className="text-fut-600 h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-2">Compartilhe</h3>
                <p className="text-sm text-muted-foreground">
                  Envie o link para o WhatsApp e convide os jogadores
                </p>
              </div>

              <div className="glass-card p-5 rounded-xl shadow-sm border border-fut-200 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-fut-100 flex items-center justify-center mb-4">
                  <ClipboardList className="text-fut-600 h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-2">Gerencie a Lista</h3>
                <p className="text-sm text-muted-foreground">
                  Acompanhe as confirmações e copie a lista numerada
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-fut-900">
              Como funciona
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 order-2 md:order-1">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-fut-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-fut-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">
                      1. Crie um evento
                    </h3>
                    <p className="text-muted-foreground">
                      Defina data, hora, local e número de jogadores para seu
                      evento de futebol.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-fut-100 flex items-center justify-center flex-shrink-0">
                    <Share className="text-fut-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">
                      2. Compartilhe o link
                    </h3>
                    <p className="text-muted-foreground">
                      Envie o convite para o grupo do WhatsApp com apenas um
                      clique.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-fut-100 flex items-center justify-center flex-shrink-0">
                    <UserPlus className="text-fut-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">
                      3. Jogadores confirmam presença
                    </h3>
                    <p className="text-muted-foreground">
                      Os convidados adicionam seus nomes através do link, sem
                      precisar criar conta.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-fut-100 flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="text-fut-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">
                      4. Gerencie a lista
                    </h3>
                    <p className="text-muted-foreground">
                      Acompanhe em tempo real quem confirmou e copie a lista
                      numerada para compartilhar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative order-1 md:order-2">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-fut-400/10 rounded-full blur-3xl -z-10"></div>
                <div className="glass-card p-6 rounded-xl shadow-lg border border-fut-200 max-w-sm mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Fut de Quarta</h3>
                    <div className="text-sm bg-fut-100 text-fut-700 px-2 py-1 rounded-full">
                      10 vagas
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-fut-600" />
                      <span>Quarta, 19 de Junho - 19:00</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-fut-600" />
                      <span>Quadra Esportiva Central</span>
                    </div>
                  </div>

                  <div className="border-t border-fut-100 pt-4 mb-4">
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Jogadores (4/10)</span>
                    </h4>

                    <ul className="space-y-2">
                      {[
                        "Carlos Silva",
                        "Roberto Almeida",
                        "João Paulo",
                        "Marcos Santos",
                      ].map((name, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm p-2 bg-white rounded-md border border-fut-50"
                        >
                          <div className="w-5 h-5 rounded-full bg-fut-600 flex items-center justify-center text-white text-xs">
                            {index + 1}
                          </div>
                          <span>{name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-fut-600 hover:bg-fut-700">
                    Confirmar Presença
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-fut-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Lista do Fut. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
