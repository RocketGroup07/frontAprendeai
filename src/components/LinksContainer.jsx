import LinkRedirecionavel from './LinkRedirecionavel'

function LinksContainer(turmaId, children) {
  return (
    <div className='w-[90%] mr-auto ml-auto mt-4 flex flex-row gap-[48px] p-1 text-[var(--text)]'>
        <LinkRedirecionavel nome={"Geral"} link={"/turmas/" + {turmaId}} className="bg-[var(--primary)] text-[var(--text)] p-2 rounded cursor-pointer" />
        <LinkRedirecionavel nome={"Atividades"} link={"/Atividades/" + {turmaId}} className="p-2 cursor-pointer" />
        <LinkRedirecionavel nome={"Favoritos"} link={"/Favoritos/" + {turmaId}} className="p-2 cursor-pointer" />

        {children}
    </div>
  )
}

export default LinksContainer