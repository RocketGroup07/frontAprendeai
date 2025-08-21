import React from 'react';

function Card({ nomeCurso}) {
  return (
    <div className="card" style={{display: 'flex',marginLeft:'75px', marginTop:'24px' ,flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', width: '382px', height: '216px'}}>
      <div className="cursoTitle" style={{backgroundColor: '#2a2a2a', height:'190px' , color: '#fff', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}>
          <h2 style={{fontWeight:'500', fontSize:'31px'}}>{nomeCurso}</h2>
      </div>
      <div className="infoTurma" style={{display: 'flex', justifyContent:'end', backgroundColor: '#d00909', color: '#fff', width: '100%'}}>
        <a href="">Clique para saber mais</a>
      </div>
    </div>
    
  );
}

export default Card;