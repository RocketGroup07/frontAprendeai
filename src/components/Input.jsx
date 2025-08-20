function Input({
  id,
  value,
  onChange,
  placeholder,
  register,
  type
}) {
  return (
    <div className='w-80 mx-auto mt-10'>
      <input
      style={{ backgroundColor: '#4a4a4a' }}
        className='p-4 items-left text-white rounded-md w-full uppercase placeholder:text-white outline-0 border-1 border-white'
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...register}
        type={type}
      />
    </div>
  )
}

export default Input