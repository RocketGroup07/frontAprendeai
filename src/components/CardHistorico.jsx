import { IoMdShareAlt } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { LuCalendarClock } from 'react-icons/lu';
import { Link } from 'react-router-dom';

// parse seguro para evitar shift de timezone em strings "YYYY-MM-DD"
function parseDateSafe(value) {
  if (!value) return null;
  // se já for Date ou timestamp
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);

  // string no formato YYYY-MM-DD (date-only) -> criar Date local sem aplicar timezone
  const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (isoDateOnly) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  // caso tenha hora/UTC, usar Date normal
  return new Date(value);
}

// Componente CardHistorico
function CardHistorico({ item }) {
  if (!item) return null;

  const dataAula = item.dataAula || item.data || item.createdAt || '';
  const conteudo = item.conteudo || item.descricao || '';
  const horas = item.horasTotais ?? item.horasMaximas ?? item.horasPresentes ?? '';
  const diaAulaId = item.id || item.turma_id || '';
  const dateObj = parseDateSafe(dataAula);
  const formattedDate = dateObj ? dateObj.toLocaleDateString() : '—';

  return (
    <div className="flex flex-wrap gap-4 font-neuli">
      <Link
        className='cursor-pointer hover:scale-103 transition-transform relative group'
        to={diaAulaId ? `/dia-aula/${diaAulaId}` : `/geral/`}
      >
        <div className="w-80 h-40 bg-[var(--main)] text-white rounded-t-lg p-10 flex flex-col justify-between items-center text-center relative">
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