import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ModalInput from "./ModalInput";

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

  useEffect(() => {
    if (!showModal) reset();
  }, [showModal, reset]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-80"
        onClick={() => setShowModal(false)}
      />

      {/* Modal box */}
      <div className="flex items-center justify-center min-h-screen">
        <div
          ref={modalRef}
          className="bg-[#1a1a1a] rounded-lg shadow-lg p-6 w-150 h-auto flex flex-col items-center relative"
        >
          {/* Botão fechar */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-2 text-white font-light text-5xl p-2 cursor-pointer"
          >
            &times;
          </button>

          {/* Título */}
          <h2 className="text-2xl font-bold mb-4 text-[#f1f1f1]">{nomeModal}</h2>

          {/* Formulário */}
          <form
            className="flex flex-col gap-4 mt-4 w-full items-start"
            onSubmit={handleSubmit(
              async (data) => {
                await onSubmit(data);
                reset();
              },
              (errs) => console.warn("Erros de validação:", errs)
            )}
          >
            {fields.map((field) => {
              const fileValue = watch(field.name);

              return (
                <div key={field.name} className="w-full flex flex-col gap-1">
                  <label className="text-left text-white">{field.label}</label>

                  {/* TEXTAREA */}
                  {field.type === "textarea" && (
                    <ModalInput
                      name={field.name}
                      type="textarea"
                      register={register}
                      watch={watch}
                      rules={{
                        required: field.required ? `${field.label} é obrigatório(a)` : false,
                        ...(field.maxLength ? { maxLength: field.maxLength } : {}),
                        validate: (value) =>
                          value.trim() !== "" || `${field.label} não pode conter apenas espaços`
                      }}
                      placeholder={field.placeholder}
                      error={errors[field.name]}
                    />
                  )}

                  {/* FILE */}
                  {field.type === "file" && (
                    <label className="flex items-center justify-between gap-3 w-full bg-[#4a4a4a] p-3 text-white rounded-md cursor-pointer">
                      <span>
                        {fileValue instanceof File ? fileValue.name : "Selecionar arquivo..."}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        {...register(field.name, {
                          required: field.required ? `${field.label} é obrigatório(a)` : false
                        })}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setValue(field.name, file, {
                            shouldValidate: !!field.required,
                            shouldDirty: true
                          });
                        }}
                      />
                    </label>
                  )}

                  {/* INPUT NORMAL */}
                  {field.type !== "textarea" && field.type !== "file" && (
                    <ModalInput
                      name={field.name}
                      type={field.type}
                      register={register}
                      watch={watch}
                      defaultValue={field.defaultValue}

                      min={field.min}
                      max={field.max}

                      rules={{
                        required: field.required ? `${field.label} é obrigatório(a)` : false,
                        ...(field.maxLength ? { maxLength: field.maxLength } : {}),
                        ...(field.min ? { min: { value: field.min, message: `Valor mínimo: ${field.min}` } } : {}),
                        ...(field.max ? { max: { value: field.max, message: `Valor máximo: ${field.max}` } } : {}),
                        validate: field.validate
                      }}
                      placeholder={field.placeholder}
                      error={errors[field.name]}
                    />

                  )}

                  {/* Erro */}
                  {errors[field.name] && (
                    <span className="text-red-500 text-sm">
                      {errors[field.name].message || "Campo inválido"}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Botões */}
            <div className="flex gap-2 w-full justify-end mt-8">
              <button
                type="button"
                onClick={() => { reset(); setShowModal(false); }}
                className="px-4 py-2 text-white border border-gray-300 rounded hover:bg-white hover:text-black cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--primary)] text-white rounded hover:bg-[#b30404] cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;
