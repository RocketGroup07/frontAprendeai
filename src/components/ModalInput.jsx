import React from "react";

// ======= Input específico para Modal =======
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
  min,
  max
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

  // ===== Data: default hoje e limites ±7 dias =====
  if (type === "date") {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
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

    rules.min ??= format(minDate);
    rules.max ??= format(maxDate);
  }

  // ===== Input type number com limite de dígitos + min/max =====
  const handleNumberChange = (e) => {
    let val = e.target.value;

    // Remove caracteres não numéricos
    val = val.replace(/\D/g, "");

    // Limita quantidade de dígitos
    if (maxDigits) val = val.slice(0, maxDigits);

    // Aplica limites min e max (se existirem)
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
        />
      ) : (
        <input
          type={type === "number" ? "text" : type} // permanece text para suportar maxLength
          placeholder={placeholder}
          disabled={disable}
          maxLength={safeMaxLength}
          className={`w-full bg-[#4a4a4a] p-4 text-white rounded-md outline-0 border
            ${error ? "border-red-500" : "border-white"} ${className}`}
          defaultValue={defaultValue}
          onChange={type === "number" ? handleNumberChange : onChange}
          {...register(name, rules)}
        />
      )}

      {/* contador de caracteres */}
      {showCount &&
        safeMaxLength &&
        (type === "text" || type === "textarea" || type === "number") && (
          <span className="text-gray-400 text-xs mt-1 self-end">
            {value.length} / {safeMaxLength}
          </span>
        )}
    </div>
  );
}

export default ModalInput;
