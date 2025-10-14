import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [turmaId, setTurmaId] = useState(null);

  // 🔹 Recupera dados do localStorage no carregamento
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedTurmaId = localStorage.getItem('turmaId');
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (token && userData) {
      setUsuario(userData);
    }

    if (savedTurmaId) {
      setTurmaId(savedTurmaId);
    }
  }, []);

  // 🔹 Salva o turmaId no localStorage sempre que mudar
  useEffect(() => {
    if (turmaId) {
      localStorage.setItem('turmaId', turmaId);
    } else {
      localStorage.removeItem('turmaId');
    }
  }, [turmaId]);

  // 🔹 Função de login
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUsuario(userData);
  };

  // 🔹 Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('turmaId');
    setUsuario(null);
    setTurmaId(null);
  };

  // 🔹 Função para selecionar uma turma
  const selecionarTurma = (id) => {
    setTurmaId(id);
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      setUsuario,
      login,
      logout,
      turmaId,
      setTurmaId,
      selecionarTurma
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 Hook para usar o AuthContext
export function useAuth() {
  return useContext(AuthContext);
}