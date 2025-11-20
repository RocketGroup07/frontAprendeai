import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [turmaId, setTurmaId] = useState(null);
  const [turmaNome, setTurmaNome] = useState(null);
  const userData = JSON.parse(sessionStorage.getItem('userData'));

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const savedTurmaId = sessionStorage.getItem('turmaId');
    const savedTurmaNome = sessionStorage.getItem('turmaNome');

    if (token && userData) setUsuario(userData);
    
    selecionarTurma(savedTurmaId, savedTurmaNome || null);
  }, []);

  const login = (token, userData) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('userData', JSON.stringify(userData));
  setUsuario(userData);
};

  const logout = () => {
    sessionStorage.clear();
    setUsuario(null);
    setTurmaId(null);
    setTurmaNome(null);
  };

  // aceitar nome opcional
  const selecionarTurma = (id, nome = null) => {
    setTurmaId(id);
    if (nome) setTurmaNome(nome);
    return;
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
      selecionarTurma,
      isProfessor: userData && userData.papel === 'ADMIN',
      isAluno: userData && userData.papel === 'USER',
      usuarioId: userData ? userData.id : null
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}