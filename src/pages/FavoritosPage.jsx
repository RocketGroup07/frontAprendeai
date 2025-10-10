import { useParams } from 'react-router';
import LinkRedirecionavel from '../components/LinkRedirecionavel'
import StaggeredMenu from '../components/StaggeredMenu';

function FavoritosPage
  () {
  const { turmaId } = useParams();
  return (

    <div>

      <div style={{ height: "10vh" }}>
        <StaggeredMenu />
      </div>

      <div className='min-h-screen font-neuli'>
        <div className='flex flex-col items-center justify-center gap-10 pt-10'>
          <div className='w-[90%] h-[137px] p-7 bg-[var(--main)] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px]'>
            <h2>Favoritos</h2>
          </div>
        </div>
        <div className='w-[90%] mr-auto ml-auto mt-4 flex flex-row gap-[48px] p-1 text-white'>
          <LinkRedirecionavel nome={"Geral"} link={"/geral/" + turmaId} className="p-2  cursor-pointer" />
          <LinkRedirecionavel nome={"Atividades"} link={"/atividades/" + turmaId} className="p-2 cursor-pointer" />
          <LinkRedirecionavel nome={"Favoritos"} link={"/favoritos/" + turmaId} className="p-2 cursor-pointer bg-[var(--primary)] text-white rounded " />
        </div>



      </div>



    </div>
  )
}

export default FavoritosPage
