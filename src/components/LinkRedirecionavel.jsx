import { useNavigate } from 'react-router-dom';

function LinkRedirecionavel({nome, link, className}) {
    const navigate = useNavigate();
  return (
    <div className={className} ><a onClick={() => navigate(link)}>{nome}</a></div>
  )
}

export default LinkRedirecionavel