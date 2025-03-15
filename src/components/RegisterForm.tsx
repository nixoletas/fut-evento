import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import GoogleButton from "./ui/google-button";

const googleLogin = () => {
  console.log("google login");
};

const RegisterForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro de registro",
        description: "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-fut-800">
          Criar Conta
        </CardTitle>
        <CardDescription className="text-center">
          Cadastre-se para organizar eventos de futebol
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="bg-white/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-white/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/50"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-fut-600 hover:bg-fut-700"
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>
        <div
          onClick={() => {
            window.open(
              "https://amgadiltkvpcjtrbfvhx.supabase.co/auth/v1/authorize?provider=google",
              "_self"
            );
          }}
        >
          <GoogleButton />
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="link" onClick={() => navigate("/login")}>
          Já tem uma conta? Entrar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
