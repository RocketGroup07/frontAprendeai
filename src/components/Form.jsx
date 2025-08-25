import Input from './Input'



function Form({ onSubmit, children, title }) {
  return (
    <div className='bg-[url(../src/assets/images/background_pb.png)] bg-cover bg-center h-screen flex items-center justify-center'>
        <form onSubmit={onSubmit} className='w-96 mx-auto bg-amber-200 p-4  mt-10 flex flex-col gap-5 '>
            <div className='flex justify-center items-center uppercase text-white font-semibold my-[12px] mx-auto'>
                <h1 className='text-4xl'>{title} Login</h1>
            </div>
            <div className='flex flex-col gap-[10px]'>
                <Input
                placeholder={"Email"}
                type={"text"}
                />
                <Input
                placeholder={"senha"}
                type={'password'}/>
            </div>
        </form>
    </div>
  )
}



export default Form