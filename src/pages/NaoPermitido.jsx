import { Link } from 'react-router-dom';

const NaoPermitido = () => {
  return (
    <div className='text-white' style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center'
    }}>
      <h1>Acesso Não Permitido</h1>
      <p>Você precisa estar logado para acessar esta página.</p>
      <Link to="/" className='bg-[var(--primary)] p-5 rounded-sm ' style={{ marginTop: '20px', fontSize: '18px' }}>
        Ir para a página de Login
      </Link>
    </div>
  );
};

export default NaoPermitido;