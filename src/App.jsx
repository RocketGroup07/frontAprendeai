import Turmas from "./pages/turmas";
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