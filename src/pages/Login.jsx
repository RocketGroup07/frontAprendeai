import Input from '../components/Input'
import Form from '../components/Form'
import Button from '../components/FormButton'
import LinkRedirecionavel from '../components/LinkRedirecionavel'
import bg from '../assets/images/background.png'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { api } from "../lib/axios";
import { useNavigate } from 'react-router'
import { useAuth } from '../components/UserAuth';

function Login() {
  const { register: registerLogin, handleSubmit: handleSubmitLogin, formState: { errors: errorsLogin } } = useForm();
  const { register: registerCodigo, handleSubmit: handleSubmitCodigo, formState: { errors: errorsCodigo } } = useForm();
  const { login: loginContext } = useAuth();
  const navigate = useNavigate();

  const onSubmitLogin = async (data) => {
    try {
      const response = await api.post("login/", {
        login: data.login,
        senha: data.senha,
      });

      const token = response.data.token;
      const userData = response.data.usuario;

      if (!token || !userData) {
        toast.error(response.data?.mensagem || "Erro no login. Verifique suas credenciais.");
        return;
      }

      sessionStorage.setItem("token", token);
      if (userData && userData.nome) {
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }
      loginContext(token, userData);

      toast.success("Login realizado com sucesso!");
      setTimeout(() => navigate("turmas"), 1500);

    } catch (error) {
      if (error.response) {
        toast.error(`Erro no login: ${error.response.data?.mensagem || error.response.status}`);
      } else {
        toast.error("Erro no login. Verifique sua conexão.");
      }
    }
  };

  const onSubmitCodigo = async (data) => {
    try {
      const response = await api.post("turmas/validar-codigo", {
        codigoTurma: data.codigoTurma,
      });
      sessionStorage.setItem("codigoTurma", data.codigoTurma);
      toast.success("Código validado com sucesso!");
      setTimeout(() => navigate("/cadastro/" + data.codigoTurma), 1500);
    } catch (error) {
      toast.error("Código inválido.");
      if (error.response) {
        toast.error(`Erro: ${error.response.data?.mensagem || error.response.status}`);
      }
    }
  };

  const onError = (errors) => {
    Object.values(errors).forEach((err) => {
      toast.error(err.message);
    });
  };

  return (
    <div className='bg-cover bg-center h-screen' style={{ backgroundImage: `url(${bg})` }}>
      <div className='min-h-[70vh] flex flex-col justify-center'>
        <div className='m-auto'>
          <img src="../images/logoAP.png" alt="Logo" />
        </div>

        <div className="flex justify-center gap-8 mt-8">
          {/* FORM LOGIN */}
          <Form
            title={"Login"}
            onSubmit={handleSubmitLogin(onSubmitLogin, onError)}
          >
            <Input
              placeholder="Email"
              type="email"
              name="login"
              register={registerLogin}
              rules={{
                required: "O e-mail é obrigatório",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Digite um e-mail válido"
                }
              }}
              error={!!errorsLogin.login}
            />
            <Input
              placeholder="Senha"
              type="password"
              name="senha"
              register={registerLogin}
              rules={{
                required: "A senha é obrigatória",
                minLength: { value: 6, message: "A senha deve ter no mínimo 6 caracteres" }
              }}
              error={!!errorsLogin.senha}
            />
            <div className='flex justify-end p-1 text-white'>
              <LinkRedirecionavel
                nome={"Esqueci a senha"}
                link={"/#"}
                className="cursor-pointer hover:text-[#d3d3d3] underline duration-200 bg-transparent"
              />
            </div>
            <Button>Entrar</Button>
          </Form>

          {/* DIVISOR */}
          <div className="w-2 bg-[#3f3e40] rounded -my-14"></div>

          {/* FORM CÓDIGO */}
          <Form
            title={"Digite o código de acesso da turma"}
            onSubmit={handleSubmitCodigo(onSubmitCodigo, onError)}
          >
            <Input
              className="text-center uppercase"
              placeholder="Digite o código da turma"
              name="codigoTurma"
              register={registerCodigo}
              rules={{
                required: "O código da turma é obrigatório",
              }}
              error={!!errorsCodigo.codigoTurma}
            />
            <Button>Validar</Button>
          </Form>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 w-full p-6 bg-[var(--primary)]'></div>
    </div>
  )
}

export default Login;
