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
    Object.values(errors).forEach((err) => {
      toast.error(err.message);
    });
  };

  return (
    <div className='bg-cover bg-center h-screen flex items-center justify-center' style={{ backgroundImage: `url(${bg})` }}>
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
            required: "O email é obrigatório", pattern: {
              value: /^\S+@\S+$/i, message: "Formato de email inválido"
            }
          }}
        />

        <Input
          placeholder="Senha"
          type="password"
          name="password"
          register={registerLogin}
          rules={{ required: "A senha é obrigatória" }}
        />

        <div className='flex justify-end gap-[48px] p-1 text-white'>
          <LinkRedirecionavel
            nome={"Esqueci a senha"}
            link={"/#"}
            className="cursor-pointer hover:text-[#d3d3d3] underline duration-200"
          />
        </div>

        <Button>Entrar</Button>
      </Form>

      <div className="w-2 h-4/6 bg-[#3f3e40] rounded-md mx-8 br"></div>

      <Form title={"Digite o código de acesso a turma"} onSubmit={handleSubmitCodigo(onSubmit, onError)}>
        <Input
          placeholder="Digite o código da turma"
          type="text"
          name="codigoTurma"
          register={registerCodigo}
          rules={{ required: "O código da turma é obrigatório" }}
        />

        <Button>Validar</Button>
      </Form>
    </div>
  )
}

export default Login