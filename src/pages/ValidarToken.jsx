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
  const [searchParams] = useSearchParams();

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm({
    values: {
      email: searchParams.get('email'),
      token: searchParams.get('token'),
      novaSenha: '',
      confirmarSenha: ''
    }
  });
  const navigate = useNavigate();

  // Preenche email e token da URL, se houver
  useEffect(() => {
    const tokenFromQuery = searchParams.get('token');
    const emailFromQuery = searchParams.get('email');

    console.log(tokenFromQuery, emailFromQuery);

    if (tokenFromQuery) setValue('token', tokenFromQuery);
    if (emailFromQuery) setValue('email', emailFromQuery);
  }, [searchParams, setValue]);

  const onSubmit = async (data) => {
    try {
      if (data.novaSenha) {
        if (data.novaSenha !== data.confirmarSenha) {
          toast.error('As senhas não coincidem.');
          return;
        }

        await api.post('/redefinicao/validar', {
          email: data.email,
          codigo: data.token,
          novaSenha: data.novaSenha
        });

        setTimeout(() => navigate(`/`), 1500);
        toast.success('Senha alterada com sucesso! Faça login com sua nova senha.');
        return;
      }

      toast.error('Senha invalida. Por favor, insira uma nova senha.');

    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.mensagem || 'Token inválido ou expirado.');
      } else {
        toast.error('Erro ao conectar com o servidor.');
      }
    }
  };

  const onError = (errs) => Object.values(errs).forEach(e => toast.error(e.message));


  return (
    <div className='bg-cover bg-center h-screen' style={{ backgroundImage: `url(${bg})` }}>
      <div className='min-h-[70vh] flex flex-col justify-center'>
        <div className='m-auto'>
          <img src="../images/logoAP.png" alt="Logo" />
        </div>

        <div className='flex justify-center mt-10'>
          <Form title={'Validar token / Nova senha'} onSubmit={handleSubmit(onSubmit, onError)}>

            {/* E-MAIL */}
            <Input
              disable={true}
              placeholder='E-mail'
              type='email'
              name='email'
              register={register}
              rules={{ required: 'O e-mail é obrigatório' }}
              error={!!errors.email}
            />

            {/* TOKEN */}
            <Input
              disable={true}
              placeholder='Insira o código recebido por e-mail'
              type='text'
              name='token'
              register={register}
              rules={{ required: 'O código é obrigatório' }}
              error={!!errors.token}
            />

            <p className='text-sm text-[#d3d3d3] mb-4'>
              Cole o token enviado por e-mail ou use o link recebido.
            </p>

            {/* CAMPOS DE SENHA APARECEM ASSIM QUE O USUÁRIO DIGITA O TOKEN */}

            <Input
              placeholder='Nova senha'
              type='password'
              name='novaSenha'
              register={register}
              rules={{
                required: 'A nova senha é obrigatória',
                minLength: { value: 6, message: 'A senha deve ter no mínimo 6 caracteres.' }
              }}
              error={!!errors.novaSenha}
            />

            <Input
              placeholder='Confirme a nova senha'
              type='password'
              name='confirmarSenha'
              register={register}
              rules={{
                validate: (value) => {
                  const nova = watch('novaSenha');
                  if (value !== nova) return 'As senhas não coincidem';
                  return true;
                }
              }}
              error={!!errors.confirmarSenha}
            />

            <p className='text-sm text-[#d3d3d3] mb-2'>
              Agora redefina sua senha.
            </p>



            <Button>Enviar</Button>

          </Form>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 w-full p-6 bg-[var(--primary)]'></div>
    </div>
  )
}

export default ValidarToken
