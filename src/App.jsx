import Geral from "./pages/Geral.jsx";
import Turmas from "./pages/Turmas.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
     <Router>
      <Routes>
        {/*<Route path="/" element={<Home />} />*/}
        {/*<Route path="/login" element={<Login />} />*/}
        <Route path='/turmas' element={<Turmas/>} />
        <Route path='/geral' element={<Geral/>} />
      </Routes>
    </Router>    
    </>
  );
}

export default App;