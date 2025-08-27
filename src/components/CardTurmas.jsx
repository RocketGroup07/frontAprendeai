import dados from '../dtbs.json';
import { IoMdShareAlt } from "react-icons/io";

function CardTurmas() {
    return (
        <div className="flex flex-wrap gap-4 font-neuli ">
            {dados.slice(0, 3).map((item, index) => (
                <div key={index} className='cursor-pointer hover:scale-103 transition-transform'>
                    {/* AQUI ESTÁ A MUDANÇA: 'flex', 'flex-col' e 'justify-between' */}
                    <div
                        className="w-80 h-32 bg-[#2A2A2A] text-white rounded-t-lg p-10 flex flex-col justify-between"
                    >
                        <div>
                            <h2 className='text-3xl line-clamp-1'>{item.nomeCurso}</h2>
                            <div className='mt-5 font-extralight text-[16px]'>
                               {/*  <p className="overflow-hidden line-clamp-3">
                                    {item.descricao}
                                </p> */}
                            </div>
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