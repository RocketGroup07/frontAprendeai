import { useForm } from 'react-hook-form';
import Form from './Form';
import Input from './Input';
import LinkRedirecionavel from './LinkRedirecionavel';
import FormButton from './FormButton';
import { toast } from 'react-toastify';
import { api } from "../lib/axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './UserAuth';

function FormCadastro() {
  const {
    register,
    handleSubmit,
  } = useForm();

  const navigate = useNavigate();

  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      // envia para o backend
      await api.post("alunos/cadastrar", {
        nome: data.nome,
        login: data.login,
        senha: data.senha,
      });

      login(null, { nome: data.nome, login: data.login });
      toast.success('Cadastro realizado com sucesso!');
      setTimeout(() => {
        navigate("/geral/");
      }, 1500);

    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error('Há algo de errado no seu cadastro!');
    }
  };

  const onError = (errors) => {
    Object.values(errors).forEach((err) => {
      toast.error(err.message);
    });
  };

  return (
    <div>
      <Form
        title={"Cadastro"}
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <Input
          placeholder="Nome"
          type="text"
          name="nome"
          id="nome"
          register={register}
          rules={{
            required: "O nome é obrigatório"
          }}
        />

        <Input
          placeholder="Email"
          type="email"
          name="login"
          id="login"
          register={register}
          rules={{
            required: "O email é obrigatório",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Formato de email inválido"
            }
          }}
        />

        <Input
          placeholder="Senha"
          type="password"
          name="senha"
          id="senha"
          register={register}
          rules={{
            required: "A senha é obrigatória",
            minLength: {
              value: 6,
              message: "A senha deve ter no mínimo 6 caracteres"
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

        <FormButton>Cadastrar</FormButton>
      </Form>
    </div>
  );
}

export default FormCadastro;
