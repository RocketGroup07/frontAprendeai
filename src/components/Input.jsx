function Input({ name, register, rules, placeholder, type = "text", className = "" }) {
  return (
    <div>
      <input
        className={`w-full bg-[#4a4a4a] p-4 items-left text-white rounded-md placeholder:uppercase font-neuli outline-0 border border-white ${className}`}
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
      />
    </div>
  )
}

export default Input
