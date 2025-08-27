import Input from '../components/Input'
import Form from '../components/Form'
import Button from '../components/FormButton'
import LinkRedirecionavel from '../components/LinkRedirecionavel'

function Login() {
  return (
    <div className='bg-[url(../src/assets/images/background.png)] bg-cover bg-center h-screen flex items-center justify-center'>
      <Form
        title={"Login"}
        >
        <Input
          placeholder={"Email"}
          type={"text"}
        />
        <Input
          placeholder={"senha"}
          type={'password'}
        />

        <div className='flex justify-end gap-[48px] p-1 text-white'>
          <LinkRedirecionavel
            nome={"Esqueci a senha"}
            link={"/#"}
            className="cursor-pointer hover:text-[#d3d3d3] underline duration-200"
          />
        </div>

        <Button value={"Entrar"} />
      </Form>

      <div className="w-2 h-4/6 bg-[#3f3e40] rounded-md mx-8 br"></div>

      <Form title={"Digite o código de acesso a turma"}>
        <Input
          placeholder={"Digite o código da turma"}
          type={"text"}
        />

        <Button value={"Validar"} />
      </Form>
    </div>
  )
}

export default Login