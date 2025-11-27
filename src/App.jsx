import Geral from "./pages/Geral.jsx";
import Login from "./pages/Login.jsx";
import Turmas from "./pages/Turmas.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AtividadePage from "./pages/AtividadePage.jsx";
import FavoritosPage from "./pages/FavoritosPage.jsx";
import RedefinicaoSenha from "./pages/RedefinicaoSenha.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./components/UserAuth.jsx";
import DashProf from "./pages/DashProf.jsx";
import TelaPost from "./pages/TelaPost.jsx";
import ValidarToken from "./pages/ValidarToken.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import NaoPermitido from "./pages/NaoPermitido.jsx";
import TelaAtividade from "./pages/TelaAtividade.jsx";

function App() {

  return (
      <AuthProvider>
        <Router>
          <Routes>
            {/* --- ROTAS PÚBLICAS --- */}
            {/* Rotas que não exigem autenticação */}
            <Route path="/" element={<Login />} />
            <Route path='/redefinicao-senha' element={<RedefinicaoSenha />} />
            <Route path='/redefinicao-token' element={<ValidarToken />} />
            <Route path='/nao-permitido' element={<NaoPermitido />} />
            <Route path='/cadastro/:codigoTurma' element={<Cadastro />} />

            {/* --- ROTAS PRIVADAS --- */}
            {/* Rotas que exigem que o usuário esteja logado */}
            <Route path='/turmas' element={
              <PrivateRoute>
                <Turmas />
              </PrivateRoute>
            } />
            <Route path='/geral/:turmaId' element={
              <PrivateRoute>
                <Geral />
              </PrivateRoute>
            } />
            <Route path='/atividades/:turmaId' element={
              <PrivateRoute>
                <AtividadePage />
              </PrivateRoute>
            } />
            <Route path='/favoritos/:turmaId' element={
              <PrivateRoute>
                <FavoritosPage />
              </PrivateRoute>
            } />
            <Route path='/atividades/:turmaId/:atividadeId' element={
              <PrivateRoute>
                <TelaAtividade />
              </PrivateRoute>
            } />
            <Route path='/professor' element={
              <PrivateRoute>
                <DashProf />
              </PrivateRoute>
            } />
            <Route path='/post/:turmaId/:postId' element={
              <PrivateRoute>
                <TelaPost />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      

      <ToastContainer
        toastClassName="neulis-sans"
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </AuthProvider>
  );
}

export default App;