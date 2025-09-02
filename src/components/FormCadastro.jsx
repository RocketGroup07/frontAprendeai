import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function FormCadastro() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate(); 

  const onSubmit = (data) => {
    console.log(data);
    navigate('/Geral'); 
  };

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen font-neuli'> {/* FUNDO GERAL */}

      <div className="flex flex-col items-center justify-center w-full max-w-2xl px-5"> {/* REGIÃO DO FORMULÁRIO */}
        <div className="flex justify-center w-full py-5"> {/* DIV COM IMAGEM DO APRENNDE AI */}
          <img src="../images/logoAprendeAi.png" alt="Logo AprendeAi" className='w-full max-w-[20rem] object-contain' />
        </div>

        <div className='my-20 flex flex-col items-center justify-center w-full p-5 rounded-lg'>
          <h1 className='my-3 text-4xl font-medium text-white uppercase'>Cadastro</h1>

          {/* O formulário agora ocupa a largura total do contêiner pai */}
          <form className='flex flex-col w-full max-w-md p-5 space-y-3' onSubmit={handleSubmit(onSubmit)}>

            {/* ##### 1 -Input de nome ##### */}
            <input
              type="text"
              placeholder="NOME"
              className='w-full p-3 text-base text-white border border-white rounded-md bg-[#434343] placeholder-zinc-500 focus:outline-none'
              style={{ WebkitTextFillColor: 'inherit', WebkitBoxShadow: '0 0 0px 1000px rgb(67, 67, 67) inset' }}
              {...register("username", { required: true })}
            />
            {errors.username && <p className="text-sm text-red-600">Nome de usuário é obrigatório</p>}

            {/* ##### 2 - Input de email ##### */}
            <input
              type="email"
              placeholder="E-MAIL"
              className='w-full p-3 text-base text-white border border-white rounded-md bg-[#434343] placeholder-zinc-500 focus:outline-none'
              style={{ WebkitTextFillColor: 'inherit', WebkitBoxShadow: '0 0 0px 1000px rgb(67, 67, 67) inset' }}
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors.email && <p className="text-sm text-red-600">E-mail inválido</p>}

            {/* ##### 3 - Input de senha ##### */}
            <input
              type="password"
              placeholder="SENHA"
              className='w-full p-3 text-base text-white border border-white rounded-md bg-[#434343] placeholder-zinc-500 focus:outline-none'
              style={{ WebkitTextFillColor: 'inherit', WebkitBoxShadow: '0 0 0px 1000px rgb(67, 67, 67) inset' }}
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && <p className="text-sm text-red-600">Senha é obrigatória e precisa ter no mínimo 6 caracteres</p>}

            <div className='flex justify-end w-full text-sm text-zinc-500'>
              <p>Já tem cadastro?
                <a href="#" className="ml-1 text-zinc-500 hover:underline">Faça Login</a>
              </p>
            </div>

            {/* ##### 4 - botao cadastro ##### */}
            <button
              type="submit"
              className='w-full p-3 mt-3 text-2xl font-medium tracking-wide text-white uppercase transition-all duration-500 rounded-md cursor-pointer bg-red-700 hover:bg-red-800'
            >
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormCadastro;