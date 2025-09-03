import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import Input from './Input';
import LinkRedirecionavel from './LinkRedirecionavel';
import FormButton from './FormButton';
import { toast } from 'react-toastify'

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

const onError = (errors) => {
    Object.values(errors).forEach((err) => {
      toast.error(err.message);
    });
  };

  return (
    <div > {/* FUNDO GERAL */}
    <Form
        title={"Cadastro"}
        onSubmit={handleSubmit(onSubmit, onError)}
      >


        <Input
          placeholder="Nome"
          type="text"
          name="name"
          register={register}
          rules={{
            required: "O nome é obrigatório"
          }}
        />

        <Input
          placeholder="Email"
          type="email"
          name="email"
          register={register}
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
          register={register}
          rules={{ required: "A senha é obrigatória",
             minLength:{
              value: 6, message: "A senha deve ter no mínimo 6 caracteres"
            }
          }}
        />

        <div className='flex justify-end gap-[48px] p-1 text-white'>
          <LinkRedirecionavel
            nome={"Já tem cadastro? Faça Login"}
            link={"/"}
            className="cursor-pointer hover:text-[#d3d3d3] underline duration-200"
          />
        </div>

        <FormButton>Entrar</FormButton>
      </Form>
    </div>
  );
}

export default FormCadastro;