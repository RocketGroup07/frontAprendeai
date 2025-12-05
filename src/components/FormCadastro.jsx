import { useForm } from 'react-hook-form';
import Form from './Form';
import Input from './Input';
import LinkRedirecionavel from './LinkRedirecionavel';
import FormButton from './FormButton';
import { toast } from 'react-toastify';
import { api } from "../lib/axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './UserAuth';

function FormCadastro() {
    const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors: errors }
  } = useForm();

  const navigate = useNavigate();

  const { login } = useAuth();

   function getCodigoTurma() {
    const params = new URLSearchParams(location.search);
     return params.get('codigoTurma') || sessionStorage.getItem("codigoTurma");
     return params.get('codigoTurma') || sessionStorage.getItem("codigoTurma");
  }

  const onSubmit = async (data) => {
    try {
      const codigoTurma = getCodigoTurma();
      if (!codigoTurma) {
        toast.error('Código da turma não fornecido na URL.');
        return;
      }
      // envia para o backend
      const response = await api.post(`alunos/cadastro-com-turma?codigoTurma=${codigoTurma}`, {
        nome: data.nome,
        login: data.login,
        senha: data.senha,
      });

      const token = response.data.token;
      const userData = response.data.usuario;   

      login(token, userData);
      toast.success('Cadastro realizado com sucesso!');
      setTimeout(() => {
        navigate("/turmas");
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
          maxLength={100}
          register={register}
          rules={{
            required: "O nome é obrigatório"
          }}
          error={!!errors.nome}
        />

        <Input
          placeholder="Email"
          type="email"
          name="login"
          id="login"
          maxLength={100}
          register={register}
          rules={{
            required: "O email é obrigatório",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Formato de email inválido"
            }
          }}
          error={!!errors.email}
        />

        <Input
          placeholder="Senha"
          type="password"
          name="senha"
          id="senha"
          maxLength={10}
          register={register}
          rules={{
            required: "A senha é obrigatória",
            minLength: {
              value: 6,
              message: "A senha deve ter no mínimo 6 caracteres"
            }
          }}
          error={!!errors.senha}
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
