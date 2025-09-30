function Input({ name, register, rules, placeholder, type = "text", className = "", error = false }) {
  return (
    <div>
      <input
        className={` bg-[#4a4a4a] p-4 w-full items-left text-white rounded-md placeholder:uppercase font-neuli outline-0 border ${error ? 'border-red-500' : 'border-white'} ${className}`}
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
      />
    </div>
  )
}

export default Input
