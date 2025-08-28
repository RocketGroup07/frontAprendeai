import Geral from "./pages/Geral.jsx";
import Login from "./pages/Login.jsx";
import Turmas from "./pages/Turmas.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AtividadePage from "./pages/AtividadePage.jsx";
import FavoritosPage from "./pages/FavoritosPage.jsx";

function App() {

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/turmas' element={<Turmas/>} />
        <Route path='/geral' element={<Geral/>} />
        <Route path='/cadastro' element={<Cadastro/>} />
        <Route path='/atividades' element={<AtividadePage/>} />
        <Route path='/favoritos' element={<FavoritosPage/>} />
      </Routes>
    </Router>    
    </>
  );
}

export default App;