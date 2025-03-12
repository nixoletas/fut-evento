
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-fut-50">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md animate-fade-in">
          <h1 className="text-5xl font-bold text-fut-800 mb-4">404</h1>
          <p className="text-2xl font-medium text-fut-700 mb-6">Página não encontrada</p>
          <p className="text-muted-foreground mb-8">
            A página que você está procurando não existe ou pode ter sido removida.
          </p>
          
          <Button 
            className="bg-fut-600 hover:bg-fut-700"
            onClick={() => navigate("/")}
          >
            Voltar para a Página Inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
