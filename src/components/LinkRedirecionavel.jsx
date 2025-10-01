import { Link } from 'react-router-dom';

function LinkRedirecionavel({nome, link, className}) {
  return (
    <div className={className} ><Link to={link} >{nome}</Link></div>
  )
}

export default LinkRedirecionavel