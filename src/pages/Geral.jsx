import Header from '../components/Header'
import CardPosts from '../components/CardPosts'
import LinkRedirecionavel from '../components/LinkRedirecionavel'
import TextType from '../components/TextType.jsx';
import userDb from '../userDb.json';


function Geral() {
    const userName = userDb[0].nome;

    return (
        <div className='bg-[#212121] min-h-screen font-neuli'>
            <Header></Header>
            <div className='flex flex-col items-center justify-center gap-10 pt-10'>
                <div className='w-[90%] h-[137px] p-7 bg-[#2A2A2A] rounded-[9px] text-white font flex justify-center align-middle items-center font-bold text-[39px]'>

                    <TextType
                        text={[ `Olá ${userName}`, "Abaixo estão as atividades", "Happy coding!"]}
                        typingSpeed={75}
                        pauseDuration={1500}
                        showCursor={true}
                        cursorCharacter="|"
                    />

                </div>
            </div>

            <div className='w-[90%] mr-auto ml-auto mt-4 flex flex-row gap-[48px] p-1 text-white'>
                <LinkRedirecionavel
                    nome={"Geral"}
                    link={"/turmas"}
                    className="bg-[#D00909] text-white p-2 rounded cursor-pointer"
                />
                <LinkRedirecionavel
                    nome={"Atividades"}
                    link={"/Atividades"}
                    className="p-2 cursor-pointer"
                />
                <LinkRedirecionavel
                    nome={"Favoritos"}
                    link={"/Favoritos"}
                    className="p-2 cursor-pointer"
                />
            </div>

            <div className='w-[90%] m-auto mt-5'>
                <CardPosts></CardPosts>
            </div>

        </div>

    )
}

export default Geral