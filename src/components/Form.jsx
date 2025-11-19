function Form({ children, title, onSubmit }) {

  return (
    <form onSubmit={onSubmit} className='w-xl mx-auto bg-transparent p-4 mt-10 flex flex-col gap-5'>
      <div className='flex justify-center items-center uppercase text-white font-semibold my-[0.75] mx-auto'>
        <h1 className='text-4xl text-center'>
          {title}
        </h1>
      </div>
      <div className='flex flex-col gap-[1rem]'>
        {children}
      </div>
    </form>

  )
}



export default Form