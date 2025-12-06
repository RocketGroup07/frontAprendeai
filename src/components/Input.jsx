function Input({
  name,
  register,
  rules = {},
  placeholder,
  type = "text",
  className = "",
  error = false,
  disable = false,
  defaultValue,
  onChange,
  maxLength,
  min,
  max
}) {
  const inputRules = { ...rules };

  // Limita números negativos e aplica max/min se for number
  if (type === "number") {
    inputRules.min ??= min ?? 0;
    inputRules.max ??= max ?? undefined;
  }

  // Limite de caracteres para texto
  if ((type === "text" || type === "textarea") && maxLength) {
    inputRules.maxLength ??= maxLength;
  }

  // Data: default hoje e limites ±7 dias
  let defaultDate = defaultValue;
  if (type === "date") {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    defaultDate ??= `${yyyy}-${mm}-${dd}`;

    const formatDate = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 7);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);

    const minFormatted = formatDate(minDate);
    const maxFormatted = formatDate(maxDate);

    inputRules.min = minFormatted;
    inputRules.max = maxFormatted;

    // Adiciona validação personalizada
    inputRules.validate = {
      withinRange: (value) => {
        if (!value) return true;
        const selectedDate = new Date(value + 'T00:00:00');
        const min = new Date(minFormatted + 'T00:00:00');
        const max = new Date(maxFormatted + 'T00:00:00');
        
        if (selectedDate < min || selectedDate > max) {
          return "Selecione uma data entre 7 dias atrás e 7 dias à frente";
        }
        return true;
      }
    };
  }

  return (
    <div>
      <input
        disabled={disable}
        className={`w-full bg-[#4a4a4a] p-4 items-left text-white rounded-md font-neuli outline-0 border ${
          error ? "border-red-500" : "border-white"
        } ${className}`}
        placeholder={placeholder}
        type={type}
        defaultValue={defaultDate}
        onChange={onChange}
        maxLength={maxLength}
        min={inputRules.min}
        max={inputRules.max}
        {...register(name, inputRules)}
      />
    </div>
  );
}

export default Input;