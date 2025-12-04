import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Verifica se o token de autenticação existe no sessionStorage
  const token = sessionStorage.getItem("token");

  // Se não houver token, redireciona para a página de login
  if (!token) {
    return <Navigate to="/nao-permitido" />;
  }

  // Se houver token, renderiza o componente filho (a página protegida)
  return children;
};

export default PrivateRoute;