import React, { useEffect } from 'react'
import Form from '../components/Form'
import Input from '../components/Input'
import Button from '../components/FormButton'
import bg from '../assets/images/background.png'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { api } from "../lib/axios";
import { useNavigate, useSearchParams } from 'react-router-dom'

function ValidarToken() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromQuery = searchParams.get('token');
    const emailFromQuery = searchParams.get('email');
    if (tokenFromQuery) {
      setValue('token', tokenFromQuery);
    }
    if (emailFromQuery) {
      setValue('email', emailFromQuery);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data) => {
    try {
  // Chama o endpoint que espera { email, codigo }
  await api.post('/redefinicao/validar', { email: data.email, codigo: data.token });
  toast.success('Código validado — redefinição concluída. Faça login.');
  // Redireciona para a tela de login
  setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.mensagem || 'Token inválido ou expirado.');
      } else {
        toast.error('Erro ao conectar com o servidor.');
      }
    }
  }

  const onError = (errs) => Object.values(errs).forEach(e => toast.error(e.message));

  return (
    <div className='bg-cover bg-center h-screen' style={{ backgroundImage: `url(${bg})` }}>
      <div className='min-h-[70vh] flex flex-col justify-center'>
        <div className='m-auto'>
          <img src="../images/logoAP.png" alt="Logo" />
        </div>

        <div className='flex justify-center mt-10'>
          <Form title={'Validar token'} onSubmit={handleSubmit(onSubmit, onError)}>
            <Input
              placeholder='E-mail'
              type='email'
              name='email'
              register={register}
              rules={{ required: 'O e-mail é obrigatório' }}
              error={!!errors.email}
            />
            <Input
              placeholder='Insira o código recebido por e-mail'
              type='text'
              name='token'
              register={register}

              rules={{ required: 'O código é obrigatório' }}
              error={!!errors.token}
            />
            <p className='text-sm text-[#d3d3d3]'>Cole o token enviado por e-mail ou use o link recebido.</p>
            <Button>Validar</Button>
          </Form>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 w-full p-6 bg-[var(--primary)]'></div>
    </div>
  )
}

export default ValidarToken
