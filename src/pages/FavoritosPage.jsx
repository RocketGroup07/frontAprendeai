import Header from '../components/Header'
import LinkRedirecionavel from '../components/LinkRedirecionavel'

function FavoritosPage
() {
  return (
    <div>
      <Header />
      <div className='min-h-screen font-neuli'>
        <div className='flex flex-col items-center justify-center gap-10 pt-10'>
          <div className='w-[90%] h-[137px] p-7 bg-[#2A2A2A] rounded-[9px] text-white flex justify-center items-center font-bold text-[39px]'>
            <h2>Favoritos</h2>
          </div>
        </div>
        <div className='w-[90%] mr-auto ml-auto mt-4 flex flex-row gap-[48px] p-1 text-white'>
          <LinkRedirecionavel nome={"Geral"} link={"/geral"} className="p-2  cursor-pointer" />
          <LinkRedirecionavel nome={"Atividades"} link={"/atividades"} className="p-2 cursor-pointer" />
          <LinkRedirecionavel nome={"Favoritos"} link={"/favoritos"} className="p-2 cursor-pointer bg-[#D00909] text-white rounded " />
        </div>



      </div>



    </div>
  )
}

export default FavoritosPage
