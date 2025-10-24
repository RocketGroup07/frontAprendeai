import { IoMdShareAlt } from "react-icons/io";
import beca from '../assets/images/school-svgrepo.svg'
import star from '../assets/images/star.svg'

function CardTarefas({ titulo, descricao, ano }) {
    return (
        <div className='cursor-pointer hover:scale-103 transition-transform font-neuli w-80'>
            {/* AQUI ESTÁ A MUDANÇA: 'flex', 'flex-col' e 'justify-between' */}
            <div
                className="h-44 bg-[var(--main)] text-white rounded-t-lg p-5 flex flex-col justify-between"
            >
                <div>
                    <div className="flex items-center gap-3">
                        <div>
                            <img src={beca} alt="ícone de formatura" className="w-10 h-10 mb-2" />
                        </div>
                        <div>
                            <h2 className='text-[2rem] line-clamp-1 font-medium '>{titulo}</h2>
                        </div>

                    </div>

                    <div className='mt-5 font-extralight text-[11px]'>
                        <p className="overflow-hidden line-clamp-2">
                            {descricao}
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <img src={star} alt="ícone de estrela" className="w-7 h-7 mt-4 fill-zinc-300 bg-current-white" />
                    </div>
                </div>


            </div>
            <div className='bg-[var(--primary)] w-full text-white rounded-b-lg p-1 flex items-center justify-end'>
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
    )
}

export default CardTarefas