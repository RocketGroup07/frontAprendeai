import { useForm } from "react-hook-form";
import Input from "./Input";

function Modal({
  showModal,
  setShowModal,
  modalRef,
  nomeModal,
  fields = [],
  onSubmit,
  defaultValues = {}
}) {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({ defaultValues });

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black opacity-80"
        onClick={() => setShowModal(false)}
      />

      <div className="flex items-center justify-center min-h-screen">
        <div
          ref={modalRef}
          className="bg-[#1a1a1a] rounded-lg shadow-lg p-6 w-150 h-auto flex flex-col items-center relative"
        >

          {/* BOTÃO FECHAR */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-2 text-white font-light text-5xl p-2 cursor-pointer"
          >
            &times;
          </button>

          {/* TÍTULO */}
          <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">
            {nomeModal}
          </h2>

          {/* FORM */}
          <form
            className="flex flex-col gap-4 mt-4 w-full items-start"
            onSubmit={handleSubmit(
              // onValid
              async (data) => {
                try {
                  console.log("[Modal] Dados válidos — submit:", data);
                  // aguarda o onSubmit do pai (AtividadePage) - se for async, vai esperar o POST
                  await onSubmit(data);
                  // só resetar depois que o pai processou com sucesso
                  reset();
                  // IMPORTANTE: NÃO fechamos o modal aqui — o AtividadePage deve fechar quando o POST retornar com sucesso
                  console.log("[Modal] onSubmit() finalizado, esperando o pai fechar o modal.");
                } catch (err) {
                  console.error("[Modal] erro no onSubmit do pai:", err);
                }
              },
              // onInvalid
              (errs) => {
                console.warn("[Modal] Erros de validação:", errs);
                // mostra também no console em formato legível
                Object.entries(errs).forEach(([k, v]) => {
                  console.warn(`campo: ${k}`, v);
                });
              }
            )}
          >
            {fields.map((field) => {

              const fileValue = watch(field.name);

              return (
                <div key={field.name} className="w-full flex flex-col gap-1">

                  <label className="text-left text-white">{field.label}</label>

                  {/* TEXTAREA */}
                  {field.type === "textarea" && (
                    <textarea
                      {...register(field.name, {
                        required: field.required
                          ? `${field.label} é obrigatório(a)`
                          : false,
                        validate: value =>
                          value.trim() !== "" || `${field.label} não pode conter apenas espaços`
                      })}
                      className="w-full bg-[#4a4a4a] p-3 text-white rounded-md outline-0 resize-none"
                    />
                  )}

                  {/* FILE */}
                  {field.type === "file" && (
                    <label className="flex items-center justify-between gap-3 w-full bg-[#4a4a4a] p-3 text-white rounded-md cursor-pointer">
                      <span>
                        {fileValue instanceof File
                          ? fileValue.name
                          : "Selecionar arquivo..."}
                      </span>

                      {/* note: registramos o campo e atualizamos via setValue — isso mantém validação */}
                      <input
                        type="file"
                        className="hidden"
                        // não espalhamos register direto para evitar conflitos com onChange
                        {...register(field.name, {
                          required: field.required ? `${field.label} é obrigatório(a)` : false
                        })}
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          setValue(field.name, file, {
                            shouldValidate: !!field.required,
                            shouldDirty: true
                          });
                        }}
                      />
                    </label>
                  )}

                  {/* INPUT NORMAL — usando seu componente Input */}
                  {field.type !== "textarea" && field.type !== "file" && (
                    <Input
                      name={field.name}
                      type={field.type}
                      register={register}
                      rules={{
                        required: field.required ? `${field.label} é obrigatório(a)` : false,
                        ...(field.maxLength ? { maxLength: field.maxLength } : {}),
                        ...(field.min ? { min: field.min } : {}),
                        validate: field.validate
                      }}
                      placeholder={field.placeholder}
                      error={errors[field.name]}
                    />
                  )}

                  {/* ERROS */}
                  {errors[field.name] && (
                    <span className="text-red-500 text-sm">
                      {errors[field.name].message || "Campo inválido"}
                    </span>
                  )}

                </div>
              );
            })}

            {/* BOTÕES */}
            <div className="flex gap-2 w-full justify-end mt-8">
              <button
                type="button"
                onClick={() => { reset(); setShowModal(false); }}
                className="px-4 py-2 text-white border border-gray-300 rounded hover:bg-white hover:text-black"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--primary)] text-white rounded hover:bg-[#b30404]"
              >
                Confirmar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div >
  );
}

export default Modal;
