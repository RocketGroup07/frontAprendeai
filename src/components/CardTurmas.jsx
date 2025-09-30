import dados from '../dtbs.json';
import { IoMdShareAlt } from "react-icons/io";

function CardTurmas() {
    return (
        <div className="flex flex-wrap gap-4 font-neuli ">
            {dados.slice(0, 3).map((item, index) => (
                <div key={index} className='cursor-pointer hover:scale-103 transition-transform'>
                    {/* AQUI ESTÁ A MUDANÇA: 'flex', 'flex-col' e 'justify-between' */}
                    <div
                        className="w-80 h-40 bg-[#2A2A2A] text-white rounded-t-lg p-10 flex flex-col justify-between items-center text-center"
                    >
                        <div className='w-full flex justify-center items-center'>
                            <h2 className='mt-5 text-3xl w-full truncate overflow-hidden whitespace-nowrap text-center'>{item.nomeCurso}</h2>
                        </div>

                    </div>
                    <div className='bg-[#D00909] w-full text-white rounded-b-lg p-1 flex items-center justify-end'>
                        <div className='flex flex-row text-[12px] items-center gap-2 pr-2'>
                            <div>
                                <h6>Clique aqui para saber mais</h6>
                            </div>
                            <div>
                                <IoMdShareAlt />
                            </div>
                        </div>
                    </div>
                </div>              
            ))}       
        </div>
        
    );
}

export default CardTurmas;