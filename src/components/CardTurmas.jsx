import { Link } from "react-router-dom";
import { IoMdShareAlt } from "react-icons/io";
import {
  MdContentCopy,
  MdDelete,
  MdOutlineFileCopy
} from "react-icons/md";
import { api } from "../lib/axios";
import { useAuth } from "./UserAuth";
import { toast } from "react-toastify";

function CardTurmas({ turmas, onDelete, onClonar, isProfessor }) {
  const { selecionarTurma } = useAuth();

  /* COPIAR CÓDIGO */
  const handleCopiarCodigo = (e, codigo) => {
    e.preventDefault();
    e.stopPropagation();

    navigator.clipboard
      .writeText(codigo)
      .then(() => toast.success("Código copiado!"))
      .catch(() => toast.error("Erro ao copiar código"));
  };

  /* DELETAR TURMA */
  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    const ConfirmDelete = () => (
      <div className="flex gap-2">
        <button
          onClick={async () => {
            try {
              await api.delete(`/turmas/${id}`);

              toast.success("Turma deletada!");

              onDelete(id); // 🔥 estado atualizado pelo pai
            } catch (err) {
              toast.error("Erro ao deletar turma");
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Deletar
        </button>

        <button
          onClick={() => toast.dismiss()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
        >
          Cancelar
        </button>
      </div>
    );

    toast.warning(<ConfirmDelete />, {
      autoClose: false,
      closeButton: false,
      position: "bottom-right",
    });
  };


  /* CLONAR TURMA */
  const handleClonar = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await api.post(`/turmas/${id}/clonar`);
      toast.success("Turma clonada com sucesso!");

      onClonar(response.data);
    } catch (error) {
      toast.error("Erro ao clonar turma");
    }
  };


  return (
    <div className="flex flex-wrap gap-4 font-neuli">
      {turmas.map(item => (
        <Link
          key={item.id}
          to={`/geral/${item.id}`}
          onClick={() => selecionarTurma(item.id, item.nome)}
          className="cursor-pointer hover:scale-105 transition-transform relative group"
        >
          <div className="w-80 h-40 bg-[var(--main)] text-white rounded-t-lg p-10 flex flex-col justify-between items-center text-center relative">

            {/* COPIAR */}
            <button
              onClick={(e) => handleCopiarCodigo(e, item.codigo)}
              className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Copiar código"
            >
              <MdContentCopy size={18} />
            </button>

            {/* DELETAR */}
            {isProfessor && (
              <button
                onClick={(e) => handleDelete(e, item.id)}
                className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Deletar turma"
              >
                <MdDelete size={18} />
              </button>
            )}


            {/* CLONAR */}
            {isProfessor && (
              <button
                onClick={(e) => handleClonar(e, item.id)}
                className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Clonar turma"
              >
                <MdOutlineFileCopy size={18} />
              </button>
            )}


            <div className="w-full flex-col justify-center items-center">
              <h2 className="mt-5 text-3xl truncate">
                {item.nome}
              </h2>
              <p className="text-[0.7rem] mt-3">
                Código da turma: {item.codigo}
              </p>
            </div>
          </div>

          <div className="bg-[var(--primary)] w-full text-white rounded-b-lg p-1 flex items-center justify-end">
            <div className="flex text-[12px] items-center gap-2 pr-2">
              <h6>Clique aqui para saber mais</h6>
              <IoMdShareAlt />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default CardTurmas;
