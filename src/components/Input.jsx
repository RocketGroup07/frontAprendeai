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
  min, // novo
  max  // novo
}) {
  // ===== Regras automáticas =====
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

    inputRules.min ??= formatDate(minDate);
    inputRules.max ??= formatDate(maxDate);
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
        min={type === "number" ? inputRules.min : undefined}
        max={type === "number" ? inputRules.max : undefined}
        {...register(name, inputRules)}
      />
    </div>
  );
}

export default Input;
