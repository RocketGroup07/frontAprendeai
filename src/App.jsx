<<<<<<< Updated upstream
import Header from './components/Header';
import { useState } from 'react';
=======
import Geral from "./pages/Geral.jsx";
import Turmas from "./pages/turmas.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
>>>>>>> Stashed changes

function App() {

  return (
    <>
<<<<<<< Updated upstream
      <Header />
=======
     <Router>
      <Routes>
        {/*<Route path="/" element={<Home />} />*/}
        {/*<Route path="/login" element={<Login />} />*/}
        <Route path='/turmas' element={<Turmas/>} />
        <Route path='/geral' element={<Geral/>} />
      </Routes>
    </Router>
>>>>>>> Stashed changes
      
    </>
  );
}

export default App;