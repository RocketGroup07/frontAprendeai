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

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

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

      // logs detalhados
      console.log(">>> response (completo):", response);
      console.log(">>> response.data:", response.data);
      console.log(">>> response.status:", response.status);
      console.log(">>> response.headers['content-type']:", response.headers["content-type"]);

      let token = null;
      let userData = {};

      if (response.data && typeof response.data === "object") {
        // Pega token e usuário direto do backend
        token = response.data.token;
        userData = response.data.usuario;
        console.log("Usuário do backend:", userData);
      } else if (response.data && typeof response.data === "string") {
        // pode ser token puro ou mensagem de erro como "Ocorreu..."
        const maybe = response.data.trim();
        if (maybe.startsWith("eyJ")) { // JWT típico começa com eyJ
          token = maybe;
        } else {
          // é mensagem de erro do backend
          console.warn("Backend retornou string (possível erro):", maybe);
        }
      }

      if (!token) {
        toast.error(response.data?.mensagem || "Erro no login. Verifique suas credenciais.");
        return;
      }

      localStorage.setItem("token", token);
      if (userData && userData.nome) {
        localStorage.setItem("userData", JSON.stringify(userData));
      }
      loginContext(token, userData);

      toast.success("Login realizado com sucesso!");
      setTimeout(() => navigate("/geral"), 1500);
    } catch (error) {
      // axios coloca a resposta de erro em error.response
      console.error("Erro ao fazer login (catch):", error);
      if (error.response) {
        console.error("error.response.data:", error.response.data);
        console.error("error.response.status:", error.response.status);
        toast.error(`Erro no login: ${error.response.data?.mensagem || error.response.status}`);
      } else {
        toast.error("Erro no login. Verifique sua conexão.");
      }
    }
  };

  const onSubmitCodigo = async (data) => {
    try {
      const response = await api.post("validar-codigo/", {
        codigoTurma: data.codigoTurma,
      });
      toast.success("Código validado com sucesso!");
      console.log("Código validado:", response.data);
    } catch (error) {
      console.error("Erro ao validar código:", error);
      toast.error("Código inválido.");
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
          {/* Formulário de Login */}
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
            />
            <div className='flex justify-end p-1 text-white'>
              <LinkRedirecionavel
                nome={"Esqueci a senha"}
                link={"/#"}
                className="cursor-pointer hover:text-[#d3d3d3] underline duration-200"
              />
            </div>
            <Button>Entrar</Button>
          </Form>

          {/* Divisor */}
          <div className="w-2 bg-[#3f3e40] rounded -my-14"></div>

          {/* Formulário de Código */}
          <Form
            title={"Digite o código de acesso da turma"}
            onSubmit={handleSubmitCodigo(onSubmitCodigo, onError)}
          >
            <Input
              className="text-center"
              placeholder="Digite o código da turma"
              type="number"
              name="codigoTurma"
              register={registerCodigo}
              rules={{
                required: "O código da turma é obrigatório",
              }}
            />
            <Button>Validar</Button>
          </Form>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 w-full p-6 bg-[#D00909]'></div>
    </div>
  )
}

export default Login