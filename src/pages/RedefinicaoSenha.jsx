import React, { useState, useEffect } from 'react'
import Form from '../components/Form'
import Input from '../components/Input'
import Button from '../components/FormButton'
import bg from '../assets/images/background.png'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { api } from "../lib/axios";
import { useNavigate, useSearchParams } from 'react-router-dom'

function RedefinicaoSenha() {
  const [step, setStep] = useState(1); // 1 = solicitar, 2 = aplicar
  const [prefillEmail, setPrefillEmail] = useState('');
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    const tokenFromQuery = searchParams.get('token');
    if (emailFromQuery) {
      setValue('email', emailFromQuery);
      setPrefillEmail(emailFromQuery);
      setStep(2);
    }
    if (tokenFromQuery) {
      setValue('token', tokenFromQuery);
      setStep(2);
    }
  }, [searchParams, setValue]);

  const solicitar = async (data) => {
    try {
      await api.post('/redefinicao/solicitar', { email: data.email });
  toast.success('Se o e-mail existir, você receberá um token por e-mail (até 8 dígitos).');
  setPrefillEmail(data.email);
  setValue('email', data.email);
  // Redireciona para a mesma página com o e-mail nos query params para preencher o formulário de aplicação
  setTimeout(() => navigate(`/redefinicao-senha?email=${encodeURIComponent(data.email)}`), 800);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.mensagem || 'Erro ao solicitar redefinição de senha.');
      } else {
        toast.error('Erro ao conectar com o servidor.');
      }
    }
  };

  const aplicar = async (data) => {
    try {
      // Chama o endpoint de validação do backend que espera { email, codigo }
      await api.post('/redefinicao/validar', { email: data.email, codigo: data.token });
      toast.success('Código validado com sucesso. A redefinição foi concluída. Faça login.');
      setTimeout(() => navigate(`/redefinicao-token?email=${encodeURIComponent(data.email)}&token=${encodeURIComponent(data.token)}`), 1500);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data || 'Código inválido ou expirado.');
      } else {
        toast.error('Erro ao conectar com o servidor.');
      }
    }
  };

  const onError = (errs) => {
    Object.values(errs).forEach((e) => toast.error(e.message));
  }

  return (
    <div className='bg-cover bg-center h-screen' style={{ backgroundImage: `url(${bg})` }}>
      <div className='min-h-[70vh] flex flex-col justify-center'>
        <div className='m-auto'>
          {/* <img src="../images/logoAP.png" alt="Logo" /> */}
        </div>

        <div className='flex justify-center '>
          {step === 1 && (
            <Form title={'Redefinir senha'} onSubmit={handleSubmit(solicitar, onError)}>
              <Input
                placeholder='Digite seu e-mail'
                type='email'
                name='email'
                register={register}
                rules={{ required: 'O e-mail é obrigatório', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Digite um e-mail válido' } }}
                error={!!errors.email}
              />
              <p className='text-sm text-[#d3d3d3]'>Você receberá por e-mail um token de até 8 dígitos para confirmar a redefinição.</p>
              <Button>Enviar</Button>
            </Form>
          )}

          {step === 2 && (
            <Form title={'Confirme o token'} onSubmit={handleSubmit(aplicar, onError)}>
              <Input
                placeholder='E-mail'
                type='email'
                name='email'
                register={register}
                rules={{ required: 'O e-mail é obrigatório' }}
                error={!!errors.email}
              />
                <Input
                  placeholder='Código (até 8 dígitos)'
                  type='text'
                  name='token'
                  register={register}
                  rules={{ required: 'O código é obrigatório', maxLength: { value: 8, message: 'Até 8 dígitos' } }}
                  error={!!errors.token}
                />
                <p className='text-sm text-[#d3d3d3]'>Insira seu e-mail e o código (token) recebido por e-mail para validar a redefinição.</p>
                <Button>Validar código</Button>
            </Form>
          )}
        </div>
      </div>

      <div className='fixed bottom-0 left-0 w-full p-6 bg-[var(--primary)]'></div>
    </div>
  )
}

export default RedefinicaoSenha
