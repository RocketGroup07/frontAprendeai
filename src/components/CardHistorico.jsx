import React, { useEffect, useState } from 'react';
import { IoMdShareAlt } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { LuCalendarClock } from 'react-icons/lu';
import { Link, useParams } from 'react-router-dom';

// Componente CardHistorico
function CardHistorico({ item, onDelete }) {
  if (!item) return null;
  
  const dataAula = item.dataAula || item.data || item.createdAt || '';
  const conteudo = item.conteudo || item.descricao || '';
  const horas = item.horasTotais ?? item.horasMaximas ?? item.horasPresentes ?? '';
  const turmaId = item.turmaId || item.turma_id || '';
  const formattedDate = dataAula ? new Date(dataAula).toLocaleDateString() : '—';
  
  return (
    <div className="flex flex-wrap gap-4 font-neuli">
      <Link
        className='cursor-pointer hover:scale-103 transition-transform relative group'
        to={turmaId ? `/geral/${turmaId}` : `/geral/`}
      >
        <div className="w-80 h-40 bg-[var(--main)] text-white rounded-t-lg p-10 flex flex-col justify-between items-center text-center relative">
          {onDelete && (
            <button
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                onDelete(item.id || item._id); 
              }}
              className='cursor-pointer absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10'
              title="Deletar histórico"
            >
              <MdDelete size={18} />
            </button>
          )}
          <div className='w-full flex-col justify-center items-center'>
            <h2 className='text-3xl w-full items-center flex justify-between truncate overflow-hidden whitespace-nowrap text-center'>
              <span><LuCalendarClock size={48} /></span>
              {formattedDate}
            </h2>
            <p className="text-xs mt-3">{conteudo || 'Sem conteúdo'}</p>
            <p className="text-xs mt-3">Horas: {horas}</p>
          </div>
        </div>
        <div className='bg-[var(--primary)] w-full text-white rounded-b-lg p-1 flex items-center justify-end'>
          <div className='flex flex-row text-xs items-center gap-2 pr-2'>
            <div>
              <h6>Clique aqui para saber mais</h6>
            </div>
            <div>
              <IoMdShareAlt />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardHistorico;