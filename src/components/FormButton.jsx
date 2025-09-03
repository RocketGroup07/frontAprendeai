function FormButton({ children, onClick, type = 'submit' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full p-2 cursor-pointer text-white rounded-md uppercase bg-[#D00909] font-semibold text-[1.25rem] hover:bg-[#A10707] duration-300 ease-in"
    >
      {children}
    </button>
  )
}


export default FormButton