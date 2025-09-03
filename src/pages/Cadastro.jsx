import Form from "../components/Form";
import FormCadastro from "../components/FormCadastro";


function Cadastro() {
  return (
    <div className="background overflow-hidden" style={{backgroundImage: "url('../images/background_pb 1.png')", height: '100vh', width: '100%', backgroundSize: 'cover'}}>
       <div className="width-full h-full flex flex-col items-center ">
        <div className="image-content">
          <img src="./images/logoAP.png" alt="" />
        </div>
        <FormCadastro/>

       </div>
    </div>
  );
}

export default Cadastro;
