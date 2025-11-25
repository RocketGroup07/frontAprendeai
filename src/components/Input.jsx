function Input({
  name,
  register,
  rules,
  placeholder,
  type = "text",
  className = "",
  error = false,
  defaultValue, // Adiciona suporte para defaultValue
  onChange, // Adiciona suporte para onChange
}) {
  return (
    <div>
      <input
        className={`w-full bg-[#4a4a4a] p-4 items-left text-white rounded-md placeholder:uppercase font-neuli outline-0 border ${error ? "border-red-500" : "border-white"
          } ${className}`}
        placeholder={placeholder}
        type={type}
        defaultValue={defaultValue} // Passa o defaultValue para o input interno      
        onChange={onChange} // Passa o onChange para o input interno
        {...register(name, rules)} // Integração com react-hook-form
      />
    </div>
  );
}

export default Input;