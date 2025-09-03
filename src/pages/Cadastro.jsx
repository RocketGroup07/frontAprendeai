import Form from "../components/Form";
import FormCadastro from "../components/FormCadastro";
import bg from '../assets/images/background.png'


function Cadastro() {
  return (
    <div className=' overflow-hidden bg-cover bg-center h-screen' style={{ backgroundImage: `url(${bg})` }}>

    <div className="main-container min-h-[80vh] flex flex-col justify-center">

      <div className='m-auto'>
          <img src="../images/logoAP.png" alt="" />
        </div>

        <FormCadastro/>


    </div>
    </div>
  );
}

export default Cadastro;
