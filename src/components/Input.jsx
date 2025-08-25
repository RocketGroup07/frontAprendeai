function Input({
  id,
  value,
  onChange,
  placeholder,
  register,
  type
}) {
  return (
    <div>
      <input
      style={{ backgroundColor: '#4a4a4a' }}
        className='w-full p-4 items-left text-white rounded-md uppercase  outline-0 border-1 border-white'
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