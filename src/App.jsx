import Turmas from "./pages/Turmas";
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Turmas />
      
    </>
  );
}

export default App;