function Input({
  
  name, 
 
  register, 
 
  rules = {}, 
 
  placeholder, 
 
  type = "text", 
 
  className = "", 
 
  error = false, 
  disable = false,
  defaultValue, // Adiciona suporte para defaultValue
  onChange, // Adiciona suporte para onChange

}) {

  // ===== Regras automáticas baseado no tipo =====

  if (type === "number") {
    rules.min ??= 0; // Não permitir negativo
  }

  if (type === "date") {
    // Corrige timezone (sem UTC)
    if (!rules.min) {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      rules.min = `${yyyy}-${mm}-${dd}`;
    }

    // Impede qualquer maxLength vindo do Modal
    if (rules.maxLength) {
      delete rules.maxLength;
    }
  }

  if (type === "text") {
    rules.validate ??= (value =>
      value.trim() !== "" || "Texto inválido"
    );
  }

  // ===== Controle seguro para o atributo maxLength =====
  const safeMaxLength =
    type === "text" || type === "number"
      ? rules?.maxLength
      : undefined;

  return (
    <div>
      <input
        disabled={disable}
        maxLength={safeMaxLength}
        min={rules?.min}
        className={`
          w-full bg-[#4a4a4a] p-4 items-left text-white rounded-md 
          placeholder:uppercase font-neuli outline-0 border 
          ${error ? "border-red-500" : "border-white"} 
          ${className}
        `}
        placeholder={placeholder}
        type={type}
        defaultValue={defaultValue} // Passa o defaultValue para o input interno      
        onChange={onChange} // Passa o onChange para o input interno
        {...register(name, rules)} // Integração com react-hook-form
      />
    </div>
  );
  );
}

export default Input;
