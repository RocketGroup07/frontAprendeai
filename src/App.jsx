import Geral from "./pages/Geral.jsx";
import Login from "./pages/Login.jsx";
import Turmas from "./pages/Turmas.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AtividadePage from "./pages/AtividadePage.jsx";
import FavoritosPage from "./pages/FavoritosPage.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./components/UserAuth.jsx";

function App() {

  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path='/turmas' element={<Turmas />} />
            <Route path='/geral' element={<Geral />} />
            <Route path='/cadastro' element={<Cadastro />} />
            <Route path='/atividades' element={<AtividadePage />} />
            <Route path='/favoritos' element={<FavoritosPage />} />
          </Routes>
        </Router>
      

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}
        draggable
        pauseOnHover={false}
        theme="dark" />
      </AuthProvider>
    </>
  );
}

export default App;