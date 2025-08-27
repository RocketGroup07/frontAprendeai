import Header from '../components/Header';
import CardPosts from '../components/CardPosts';
import LinkRedirecionavel from '../components/LinkRedirecionavel';
import TextType from '../components/TextType.jsx';
import userDb from '../userDb.json';
import posts from '../db.json'; // Ajuste o caminho conforme a estrutura

function Geral() {
  const userName = userDb[0].nome;

  // Primeiro, removemos os posts duplicados baseados no 'id' para garantir que cada post apareça apenas uma vez.
  const uniquePosts = Array.from(new Map(posts.map(post => [post.id, post])).values());

  // Agora, agrupamos os posts únicos por data
  const postsPorData = uniquePosts.reduce((acc, post) => {
    const data = post.ano;
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push(post);
    return acc;
  }, {});

  // Ordenar as datas do mais recente para o mais antigo
  const grupos = Object.entries(postsPorData).sort((a, b) => {
    const [diaA, mesA, anoA] = a[0].split('/').map(Number);
    const [diaB, mesB, anoB] = b[0].split('/').map(Number);
    const dateA = new Date(anoA, mesA - 1, diaA);
    const dateB = new Date(anoB, mesB - 1, diaB);
    return dateB - dateA;
  });

  return (
    <div className='min-h-screen font-neuli'>
      <Header />

      <div className='flex flex-col items-center justify-center gap-10 pt-10'>
        <div className='w-[90%] h-[137px] p-7 bg-[#2A2A2A] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px]'>
          <TextType
            text={[`Olá ${userName}`, 'Abaixo estão as atividades', 'Bons estudos!']}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </div>
      </div>

      <div className='w-[90%] mr-auto ml-auto mt-4 flex flex-row gap-[48px] p-1 text-white'>
        <LinkRedirecionavel nome={"Geral"} link={"/turmas"} className="bg-[#D00909] text-white p-2 rounded cursor-pointer" />
        <LinkRedirecionavel nome={"Atividades"} link={"/Atividades"} className="p-2 cursor-pointer" />
        <LinkRedirecionavel nome={"Favoritos"} link={"/Favoritos"} className="p-2 cursor-pointer" />
      </div>

      <div className='w-[90%] m-auto mt-5 text-white'>
        {grupos.map(([data, listaPosts]) => (
          <div key={data} className="mb-8">
            {/* Cabeçalho com a data */}
            <h2 className="text-xl font-bold mb-4">{data}</h2>

            {/* Posts daquele dia */}
            <div className="flex flex-row flex-wrap gap-4">
              {listaPosts.map((post) => (
                <CardPosts
                  key={post.id}
                  titulo={post.titulo}
                  descricao={post.descricao}
                  autor={post.autor}
                  ano={post.ano}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Geral;
