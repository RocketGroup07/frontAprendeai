import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [turmaId, setTurmaId] = useState(null);
  const [turmaNome, setTurmaNome] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedTurmaId = localStorage.getItem('turmaId');
    const savedTurmaNome = localStorage.getItem('turmaNome');
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (token && userData) setUsuario(userData);
    if (savedTurmaId) setTurmaId(savedTurmaId);
    if (savedTurmaNome) setTurmaNome(savedTurmaNome);
  }, []);

  useEffect(() => {
    if (turmaId) localStorage.setItem('turmaId', turmaId);
    else localStorage.removeItem('turmaId');
  }, [turmaId]);

  useEffect(() => {
    if (turmaNome) localStorage.setItem('turmaNome', turmaNome);
    else localStorage.removeItem('turmaNome');
  }, [turmaNome]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUsuario(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('turmaId');
    localStorage.removeItem('turmaNome');
    setUsuario(null);
    setTurmaId(null);
    setTurmaNome(null);
  };

  // aceitar nome opcional
  const selecionarTurma = (id, nome = null) => {
    setTurmaId(id);
    if (nome) setTurmaNome(nome);
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      setUsuario,
      login,
      logout,
      turmaId,
      setTurmaId,
      turmaNome,
      setTurmaNome,
      selecionarTurma
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}