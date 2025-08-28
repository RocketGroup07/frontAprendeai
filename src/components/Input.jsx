function Input({ name, register, rules, placeholder, type = "text" }) {
  return (
    <div>
      <input
        className="w-full bg-[#4a4a4a] p-4 items-left text-white rounded-md placeholder:uppercase font-neuli outline-0 border border-white"
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
      />
    </div>
  )
}

export default Input
