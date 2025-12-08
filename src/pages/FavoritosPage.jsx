import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import CardPosts from '../components/CardPosts';
import CardTarefas from '../components/CardTarefas'; // Importar CardTarefas
import StaggeredMenu from '../components/StaggeredMenu';
import LinksContainer from '../components/LinksContainer';
import semTarefas from '../assets/images/semTarefas.svg';

function FavoritosPage() {
  const { turmaId } = useParams();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar e recarregar os favoritos
  const refetchFavoritos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [postsResponse, atividadesResponse] = await Promise.all([
        // Usando a rota unificada que você testou
        api.get('/favoritos/listar/'),
      ]);

      // --- ESSENCIAL: ACESSANDO CHAVES ANINHADAS CORRETAMENTE ---
      // A API retornou: { posts: [...], atividades: [...] }
      const postsData = postsResponse.data.posts || [];
      const atividadesData = postsResponse.data.atividades || [];
      // Nota: Se você usar a rota única '/favoritos/listar/', só precisa de uma Promise no Promise.all

      // 1. Mapeia e tipa os Posts
      const postsFormatados = postsData.map(post => ({
        ...post,
        type: 'post',
        id: post.postId, // Usando 'postId' como o ID do componente
        // Conteúdo é 'conteudo' e Data é 'data' no retorno da API
        descricao: post.conteudo,
        ano: new Date(post.data),
      }));

      // 2. Mapeia e tipa as Atividades/Tarefas
      const atividadesFormatadas = atividadesData.map(atividade => ({
        ...atividade,
        type: 'atividade',
        id: atividade.id,
        descricao: atividade.conteudo,
        ano: new Date(atividade.dataAtividade),
        favoritado: true // porque veio da lista de favoritosyy
      }));

      // 3. Junta os dois arrays
      const allFavoritos = [...postsFormatados, ...atividadesFormatadas];
      setFavoritos(allFavoritos);

    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
      // Mostrar erro detalhado para debug
      setError(`Erro ao carregar favoritos: ${err.message || 'Verifique a conexão com a API.'}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refetchFavoritos();
  }, []);

  const handleItemUpdate = () => {
    // Recarrega a lista completa após uma alteração (favoritar/deletar)
    refetchFavoritos();
  }

  return (
    <div className="min-h-screen font-neuli">
      {/* Menu superior */}
      <div style={{ height: '10vh' }}>
        <StaggeredMenu turmaId={turmaId} />
      </div>

      <div className="flex flex-col items-center justify-center gap-10 pt-10">
        {/* Cabeçalho da página */}
        <div className="w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px]">
          <h2>Favoritos</h2>
        </div>
      </div>

      {/* Links Container */}
      <LinksContainer turmaId={turmaId} />

      {/* Exibe os favoritos */}
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
            Nenhum post ou atividade favorita.
            <img src={semTarefas} alt="Sem favoritos" className="w-64 h-64 mt-4" />
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-7 justify-left">
            {favoritos.map((item) => {
              if (item.type === 'post') {
                return (
                  <CardPosts
                    key={`post-${item.id}`} // Usando 'id' (agora com postId)
                    id={item.id}
                    turmaId={item.turmaId}
                    titulo={item.titulo}
                    descricao={item.descricao}
                    autor={item.autor}
                    ano={item.ano}
                    onDelete={handleItemUpdate}
                  />
                );
              } else if (item.type === 'atividade') {
                return (
                  <CardTarefas
                    key={`tarefa-${item.id}`}
                    id={item.id}
                    turmaId={turmaId}
                    titulo={item.titulo}
                    descricao={item.descricao}
                    ano={item.ano}
                    onDelete={handleItemUpdate}
                    small={true}
                  />
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritosPage;