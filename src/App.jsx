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
import TelaAtividade from "./pages/TelaAtividade.jsx";
import ValidarToken from "./pages/ValidarToken.jsx";

function App() {

  return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path='/turmas' element={<Turmas />} />
            <Route path='/redefinicao-senha' element={<RedefinicaoSenha />} />
            <Route path='/redefinicao-token' element={<ValidarToken />} />
            <Route path='/geral/:turmaId' element={<Geral />} />
            <Route path='/cadastro/:codigoTurma' element={<Cadastro />} />
            <Route path='/atividades/:turmaId' element={<AtividadePage />} />  {/* Manter a rota de atividades da v1 */}
            <Route path='/favoritos/:turmaId' element={<FavoritosPage />} />
            <Route path='/professor' element={<DashProf />} />
            <Route path='/post/:turmaId/:postId' element={<TelaPost />} />
            <Route path='/atividades/:turmaId/:atividadeId' element={<TelaAtividade />} />
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
