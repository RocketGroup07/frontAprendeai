import TextType from '../components/TextType';

function EstatisticasDia({ diaHistorico, userName }) {

  const totalAlunos = diaHistorico.length;
  const presentes = diaHistorico.filter(a => (a.horasPresente ?? 0) > 0).length;
  const ausentes = totalAlunos - presentes;
  const percentualPresencaDia = totalAlunos > 0 ? (presentes / totalAlunos) * 100 : 0;
  const mediaHorasDia = totalAlunos > 0
    ? diaHistorico.reduce((acc, a) => acc + (a.horasPresente ?? 0), 0) / totalAlunos
    : 0;
  const top3Alunos = [...diaHistorico]
    .sort((a, b) => (b.horasPresente ?? 0) - (a.horasPresente ?? 0))
    .slice(0, 3)
    .map(a => a.nomeAluno);

  return (
    <div className='flex flex-col items-center justify-center gap-6 my-3'>

      <div className='w-[90%] p-7 bg-[var(--main)] rounded-[12px] text-white flex flex-col items-start text-[18px] shadow-lg'>

        <TextType
          text={[
            `Olá ${userName}!`,
            `Número de alunos: ${totalAlunos}`,
            `Alunos presentes: ${presentes} | Ausentes: ${ausentes}`,
            `Percentual de presença no dia: ${percentualPresencaDia.toFixed(2)}%`,
            `Horas médias de presença: ${mediaHorasDia.toFixed(2)}h`,
            `Top 3 alunos presentes: ${top3Alunos.join(', ')}`
          ]}
          typingSpeed={60}
          pauseDuration={1200}
          showCursor={true}
          cursorCharacter="|"
        />

        {/* Barra de presença do dia */}
        <div className='w-full mt-4'>
          <div className='w-full bg-gray-600 h-4 rounded-full'>
            <div
              className={`h-4 rounded-full ${percentualPresencaDia >= 75 ? 'bg-green-500' : percentualPresencaDia >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${percentualPresencaDia}%` }}
            ></div>
          </div>
          <p className='text-sm mt-1'>Percentual de presença do dia: {percentualPresencaDia.toFixed(2)}%</p>
        </div>

      </div>
    </div>
  );
}

export default EstatisticasDia;