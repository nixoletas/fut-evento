import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { X, Menu, LogOut, Plus } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="w-full py-4 px-5 sm:px-6 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-border fixed top-0 z-10">
      <Link to="/" className="text-primary font-bold text-xl flex items-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2 text-fut-600"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 2V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12H22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Fut Evento
      </Link>

      {user ? (
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">Meus Eventos</Link>
            </Button>
            <Button size="sm" className="bg-fut-600 hover:bg-fut-700" asChild>
              <Link to="/create-event">
                <Plus className="h-4 w-4 mr-1" />
                Novo Evento
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" />
              Sair
            </Button>
          </div>

          <div className="sm:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/dashboard">Meus Eventos</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-fut-600 hover:bg-fut-700"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/create-event">
                      <Plus className="h-4 w-4 mr-1" />
                      Novo Evento
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sair
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button size="sm" className="bg-fut-600 hover:bg-fut-700" asChild>
            <Link to="/register">Criar Conta</Link>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
