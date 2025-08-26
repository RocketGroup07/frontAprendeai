import React from 'react'

function FormButton({
  children,
  onClick,
  type = 'button',
  value
}) {
  return (
    <button className='w-full p-2 items-left text-white rounded-md uppercase bg-[#D00909] outline-0 border-1 border-white font-semibold text-[20px]' type={type} onClick={onClick}>
      {value}
    </button>
  )
}

export default FormButton