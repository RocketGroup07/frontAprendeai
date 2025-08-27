import React from 'react'

function FormButton({
  children,
  onClick,
  type = 'button',
  value
}) {
  return (
    <button className='w-full p-2 cursor-pointer text-white rounded-md uppercase bg-[#D00909] border-1 border-white font-semibold text-[20px] hover:bg-[#A10707] duration-300 ease-in' type={type} onClick={onClick}>
      {value}
    </button>
  )
}

export default FormButton