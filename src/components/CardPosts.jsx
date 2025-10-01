import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { IoMdShareAlt } from "react-icons/io";

function CardPosts({ titulo, descricao, autor, ano }) {
    return (
        <div className='cursor-pointer hover:scale-103 transition-transform font-neuli w-80'>
            {/* AQUI ESTÁ A MUDANÇA: 'flex', 'flex-col' e 'justify-between' */}
            <div
                className="h-80 bg-[#2A2A2A] text-white rounded-t-lg p-10 flex flex-col justify-between"
            >
                <div>
                    <h2 className='text-3xl line-clamp-1'>{titulo}</h2>
                    <div className='mt-5 font-extralight text-[16px]'>
                        <p className="overflow-hidden line-clamp-3">
                            {descricao}
                        </p>
                    </div>
                </div>

                {/* Este div será empurrado para o final por causa do 'justify-between' */}
                <div className='flex flex-col gap-2 pt-4'>
                    <div className='flex items-center gap-2'>
                        <p className='font-normal text-sm'>Autor:</p>
                        <p className='font-light text-sm'>{autor.nome}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <p className='font-normal text-sm'>Data:</p>
                        <p className='font-light text-sm'>{format(ano, "dd 'de' MMM yy", {locale:ptBR})}</p>
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
    );
}

export default CardPosts;