
import React from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/providers/AuthProvider";

const RegisterPage: React.FC = () => {
  const { user, loading } = useAuth();

  // Redirect if already logged in
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-fut-50">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
