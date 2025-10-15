import { useParams } from 'react-router';
import LinkRedirecionavel from '../components/LinkRedirecionavel'
import StaggeredMenu from '../components/StaggeredMenu';
import LinksContainer from '../components/LinksContainer';

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
        <LinksContainer
          turmaId={turmaId}
        />



      </div>



    </div>
  )
}

export default FavoritosPage
