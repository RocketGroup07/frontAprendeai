function Modal({ showModal, setShowModal, modalRef, handleSubmit, novoTitulo, setNovoTitulo, novaData, setNovaData, novaDescricao, setNovaDescricao, novoArquivo, setNovoArquivo, isAtividade, isTurma, isGeral, isFavoritos, nomeModal}) {
  return (
    <div>  
        {showModal && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black opacity-80" onClick={() => setShowModal(false)}></div>
            <div className="flex items-center justify-center min-h-screen">
              <div ref={modalRef} className="bg-[#1a1a1a] rounded-lg shadow-lg p-6 w-150 h-auto flex flex-col items-center relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-white font-light text-5xl p-2 cursor-pointer"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">{nomeModal}</h2>
                <form className="flex flex-col gap-4 mt-4 w-full items-start" onSubmit={handleSubmit}>
                  <label className="text-left text-white">Nome</label>
                  <input type="text" value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} className="w-full bg-[#4a4a4a] p-3 text-white rounded-md  font-neuli outline-0" />

                  {isAtividade && (
                    <>
                      <label className="text-left text-white">Data de Entrega</label>
                      <input type="date" value={novaData} onChange={e => setNovaData(e.target.value)} className="w-full bg-[#4a4a4a] p-3 text-white rounded-md  outline-0" />
                    </>
                  )}

                  
                  <label className="text-left text-white">Descrição</label>
                  <textarea value={novaDescricao} onChange={e => setNovaDescricao(e.target.value)} className="w-full bg-[#4a4a4a] p-3 text-white rounded-md  font-neuli outline-0 resize-none" />
                  <label className="text-left text-white">Anexos</label>
                  <div className="w-full">
                    <label className="flex items-center justify-between gap-3 w-full bg-[#4a4a4a] p-3 text-white rounded-md font-neuli cursor-pointer overflow-hidden">
                      <div className="flex items-center gap-3 truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 flex-shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3 3 0 014.24 4.24L9.9 17.01a1 1 0 01-1.41-1.41L17.25 7.24" />
                        </svg>
                        <span className="truncate">{novoArquivo ? (novoArquivo.name) : 'Clique para adicionar arquivo'}</span>
                      </div>
                      <input type="file" onChange={e => setNovoArquivo(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-2 w-full justify-end  mt-8">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 cursor-pointer text-white border border-gray-300 rounded hover:bg-white hover:text-black transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 cursor-pointer bg-[var(--primary)] text-white rounded hover:bg-[#b30404] transition-colors"
                    >
                      Postar Atividade
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )} 


    </div>
  )
}

export default Modal