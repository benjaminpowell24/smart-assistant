const RegenerateResponse = ({ handleRegenerateResponse }) => {
  return (
    <div className='flex flex-col justify-center'>
      <div className='text-red-500 py-2'>
        Oops, an error occurred. If this persists, create a new chat
      </div>
      <button
        onClick={() => handleRegenerateResponse()}
        className='border-solid rounded-full border-2 p-2 hover:bg-[#4F2682] hover:text-white w-fit mx-auto'
      >
        Regenerate Response
      </button>
    </div>
  )
}

export default RegenerateResponse
