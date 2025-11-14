import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [turmaId, setTurmaId] = useState(null);
  const [turmaNome, setTurmaNome] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const savedTurmaId = sessionStorage.getItem('turmaId');
    const savedTurmaNome = sessionStorage.getItem('turmaNome');
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (token && userData) setUsuario(userData);
    if (savedTurmaId) setTurmaId(savedTurmaId);
    if (savedTurmaNome) setTurmaNome(savedTurmaNome);
  }, []);

  useEffect(() => {
    if (turmaId) sessionStorage.setItem('turmaId', turmaId);
    else sessionStorage.removeItem('turmaId');
  }, [turmaId]);

  useEffect(() => {
    if (turmaNome) sessionStorage.setItem('turmaNome', turmaNome);
    else sessionStorage.removeItem('turmaNome');
  }, [turmaNome]);

  const login = (token, userData) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userData', JSON.stringify(userData));
    setUsuario(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('turmaId');
    sessionStorage.removeItem('turmaNome');
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