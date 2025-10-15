import LinkRedirecionavel from "./LinkRedirecionavel";

function LinksContainer({ turmaId, children }) {
  return (
    <div className="w-[90%] mr-auto ml-auto mt-4 flex flex-row gap-[48px] p-1 text-[var(--text)]">
      <LinkRedirecionavel
        nome="Geral"
        link={`/geral/${turmaId}`}
        className="p-2 rounded cursor-pointer"
      />
      <LinkRedirecionavel
        nome="Atividades"
        link={`/atividades/${turmaId}`}
        className="p-2 rounded cursor-pointer"
      />
      <LinkRedirecionavel
        nome="Favoritos"
        link={`/favoritos/${turmaId}`}
        className="p-2 rounded cursor-pointer"
      />

      {children}
    </div>
  );
}

export default LinksContainer;
