import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { toast } from 'react-toastify';
import CardPosts from '../components/CardPosts';
import StaggeredMenu from '../components/StaggeredMenu';
import LinksContainer from '../components/LinksContainer';
import semTarefas from '../assets/images/semTarefas.svg';

function FavoritosPage() {
  const { turmaId } = useParams();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFavoritos() {
      try {
        // Requisição GET para listar os posts favoritos
        const response = await api.get('/favoritos/listar/posts');
        console.log(response.data); // Verifica a estrutura dos dados retornados
        setFavoritos(response.data); // Armazena os favoritos no estado
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar os posts favoritos.');
        setLoading(false);
      }
    }

    fetchFavoritos();
  }, []); // Executa a requisição uma vez, quando o componente for montado
  console.log(favoritos)
  return (
    <div className="min-h-screen font-neuli">
      {/* Menu superior */}
      <div style={{ height: '10vh' }}>
        <StaggeredMenu />
      </div>

      <div className="flex flex-col items-center justify-center gap-10 pt-10">
        {/* Cabeçalho da página */}
        <div className="w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px]">
          <h2>Favoritos</h2>
        </div>
      </div>

      {/* Links Container */}
      <LinksContainer turmaId={turmaId} />

      {/* Exibe os posts favoritos */}
      <div className="w-[90%] m-auto mt-5 text-[var(--text)]">
        {loading ? (
          <div className="text-center text-white mt-10">
            <p>Carregando favoritos...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 mt-10">
            <p>{error}</p>
          </div>
        ) : favoritos.length === 0 ? (
          <div className="text-center flex flex-col-reverse items-center text-lg mt-10">
            Nenhum post favorito.
            <img src={semTarefas} alt="Sem favoritos" className="w-64 h-64 mt-4" />
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-7">
            {favoritos.map((post) => (
              <CardPosts
                key={post.postId}
                id={post.postId}
                turmaId={post.turmaId}
                titulo={post.titulo}
                descricao={post.conteudo}
                autor={post.autor}
                ano={new Date(post.data)} // Converte para objeto Date
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritosPage;
