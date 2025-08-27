import Header from "../components/Header";
import CardTurmas from "../components/CardTurmas";

function Turmas() {
  return (
     <div className="turmaContainer" style={{backgroundColor: '#212121', height: '100vh'}}>
         
          <Header />
          <div style={{display:'flex',marginTop:'24px' ,borderRadius:'9px' ,justifyContent:'center', color: '#fff', backgroundColor: '#2A2A2A', height:'136px', width:'1729px', textAlign:'center', alignItems:'center', marginLeft:'75px'}}>
            <h1 style={{fontWeight:'700', fontSize:'28px', fontStyle:'bold'}}>Suas Turmas</h1></div>
          <div className="geral" style={{backgroundColor:'#D00909',borderRadius:'4.3px' , marginLeft:'75px', marginTop:'36px' ,color: '#fff', width:'85px', display:'flex', justifyContent:'center'}}>
            <h2 style={{fontWeight:'500', fontSize:'22'}}>Geral</h2></div>
          <div className="ml-18 mt-5"><CardTurmas/></div>
     </div>
  );
}

export default Turmas;