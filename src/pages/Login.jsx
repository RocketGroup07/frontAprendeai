import Input from '../components/Input'
import Form from '../components/Form'
import Button from '../components/FormButton'
import LinkRedirecionavel from '../components/LinkRedirecionavel'
import bg from '../assets/images/background.png'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

function Login() {
  const { register: registerLogin, handleSubmit: handleSubmitLogin, formState: { errors: errorsLogin } } = useForm();

  const { register: registerCodigo, handleSubmit: handleSubmitCodigo, formState: { errors: errorsCodigo } } = useForm()

  const onSubmit = (data) => {
    console.log(data);
    toast.success("Formulário enviado com sucesso!");
  }

  const onError = (errors) => {
    Object.values(errors).forEach(err => {
      toast.error(err.message);
    });
  };

  return (
    <div className='bg-cover bg-center h-screen' style={{ backgroundImage: `url(${bg})` }}>

      <div className='min-h-[70vh] flex flex-col justify-center'>
        <div className='m-auto'>
          <img src="../images/logoAP.png" alt="" />
        </div>
        <div className='flex items-center h-[100%]'>
          <Form
            title={"Login"}
            onSubmit={handleSubmitLogin(onSubmit, onError)}
          >
            <Input
              placeholder="Email"
              type="email"
              name="email"
              register={registerLogin}
              rules={{
                required: "O e-mail é obrigatório",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Digite um e-mail válido"
                }
              }}
            />
            <Input
              placeholder="Senha"
              type="password"
              name="password"
              register={registerLogin}
              rules={{ required: "A senha é obrigatória", minLength: { value: 6, message: "A senha deve ter no mínimo 6 caracteres" } }}
            />
            <div className='flex justify-end p-1 text-white '>
              <LinkRedirecionavel
                nome={"Esqueci a senha"}
                link={"/#"}
                className="cursor-pointer hover:text-[#d3d3d3] underline duration-200"
              />
            </div>
            <Button>Entrar</Button>
          </Form>

          <div className="w-2 bg-[#3f3e40] rounded"></div>

          <Form title={"Digite o código de acesso da turma"} onSubmit={handleSubmitCodigo(onSubmit, onError)}>
            <Input
              className="text-center "
              placeholder="Digite o código da turma"
              type="number"
              name="codigoTurma"
              register={registerCodigo}
              rules={{
                required: "O código da turma é obrigatório",
              }}
            />
            <Button>Validar</Button>
          </Form>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 w-full p-6 bg-[#D00909]'></div>
    </div>
  )
}

export default Login