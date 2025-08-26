import Geral from "./pages/Geral.jsx";
import Login from "./pages/Login.jsx";
import Turmas from "./pages/Turmas.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
     <Router>
      <Routes>
        {/*<Route path="/" element={<Home />} />*/}
        <Route path="/login" element={<Login />} />
        <Route path='/turmas' element={<Turmas/>} />
        <Route path='/geral' element={<Geral/>} />
        <Route path='/cadastro' element={<Cadastro/>} />
      </Routes>
    </Router>    
    </>
  );
}

export default App;