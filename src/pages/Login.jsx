import React from 'react'
import Input from '../components/Input'
import Form from '../components/Form'
import Button from '../components/FormButton'

function Login() {
  return (
    <div className='bg-[url(../src/assets/images/background_pb.png)] bg-cover bg-center h-screen flex items-center justify-center'>
      <Form title={"Login"}>
        <Input
          placeholder={"Email"}
          type={"text"}
        />
        <Input
          placeholder={"senha"}
          type={'password'} />

          <Button value={"ENVIAR"}/>
      </Form>

      <div className='h-96 bg-red-500'>
        <p>
          teste
        </p>
      </div>

      <Form title={"Código"}>
        <Input
          placeholder={"Digite o código da turma"}
          type={"text"}
        />

        <Button value={"ENVIAR"}/>
      </Form>
    </div>
  )
}

export default Login