function ModalInput({
  name,
  register,
  watch,
  rules = {},
  placeholder,
  type = "text",
  className = "",
  error = false,
  disable = false,
  defaultValue,
  onChange,
  showCount = true,
  maxDigits, // limite de dígitos para number
  min, // pode ser string "YYYY-MM-DD" ou undefined
  max  // pode ser string "YYYY-MM-DD" ou undefined
}) {
  // ===== maxLength seguro =====
  let safeMaxLength;
  if (type === "text" || type === "textarea" || type === "number") {
    if (rules.maxLength) {
      safeMaxLength =
        typeof rules.maxLength === "object"
          ? rules.maxLength.value
          : rules.maxLength;
    } else if (type === "number" && maxDigits) {
      safeMaxLength = maxDigits;
    }
  }

  // ===== valor atual para contador =====
  const value = watch ? watch(name) ?? "" : "";

  // ===== Data: default hoje e limites ±7 dias (respeita min/max passados) =====
  let minAttr, maxAttr;
  if (type === "date") {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    // só define default se não foi passado pelo chamador
    defaultValue ??= `${yyyy}-${mm}-${dd}`;

    const format = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;

    const minDate = new Date();
    minDate.setDate(today.getDate() - 7);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);

    const minFormatted = format(minDate);
    const maxFormatted = format(maxDate);

    // use min/max passados (props) se existirem, senão use os calculados
    minAttr = typeof min !== "undefined" ? min : minFormatted;
    maxAttr = typeof max !== "undefined" ? max : maxFormatted;

    // garante que sejam strings no formato YYYY-MM-DD
    // regras de validação: usa comparação em tempo de validação para bloquear datas anteriores
    rules.validate = {
      ...rules.validate,
      withinRange: (val) => {
        if (!val) return true;
        const selectedDate = new Date(val + "T00:00:00");
        const minD = new Date(minAttr + "T00:00:00");
        const maxD = new Date(maxAttr + "T00:00:00");
        if (selectedDate < minD) {
          return `Data menor que a mínima permitida (${minAttr})`;
        }
        if (selectedDate > maxD) {
          return `Data maior que a máxima permitida (${maxAttr})`;
        }
        return true;
      }
    };
  }

  // ===== Input type number com limite de dígitos + min/max =====
  const handleNumberChange = (e) => {
    let val = e.target.value;
    val = val.replace(/\D/g, "");
    if (maxDigits) val = val.slice(0, maxDigits);
    if (val !== "") {
      const numericVal = Number(val);
      if (min !== undefined && numericVal < min) val = String(min);
      if (max !== undefined && numericVal > max) val = String(max);
    }
    onChange && onChange({ ...e, target: { ...e.target, value: val } });
  };

  return (
    <div className="w-full flex flex-col">
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          disabled={disable}
          maxLength={safeMaxLength}
          className={`w-full bg-[#4a4a4a] p-3 text-white rounded-md resize-none outline-0 border
            ${error ? "border-red-500" : "border-white"} ${className}`}
          {...register(name, rules)}
          defaultValue={defaultValue}
        />
      ) : (
        <input
          type={type === "number" ? "text" : type}
          placeholder={placeholder}
          disabled={disable}
          maxLength={safeMaxLength}
          defaultValue={defaultValue}
          min={type === "date" ? minAttr : undefined}
          max={type === "date" ? maxAttr : undefined}
          className={`w-full bg-[#4a4a4a] p-4 text-white rounded-md outline-0 border
            ${error ? "border-red-500" : "border-white"} ${className}`}
          onChange={type === "number" ? handleNumberChange : onChange}
          {...register(name, rules)}
        />
      )}

      {/* contador de caracteres */}
      {showCount &&
        safeMaxLength &&
        (type === "text" || type === "textarea" || type === "number") && (
          <span className="text-gray-400 text-xs mt-1 self-end">
            {String(value).length} / {safeMaxLength}
          </span>
        )}
    </div>
  );
}

export default ModalInput;