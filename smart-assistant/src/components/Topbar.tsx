import { Edit2, Share } from 'iconsax-react'

const Topbar = ({ createNewSession }) => {
  return (
    <section className='flex items-center justify-between w-full'>
      <div className='flex flex-col'>
        <h2 className='font-semibold text-xl'>Smart Assistant v1.0</h2>
        <p className='text-gray-400'>
          Smart Assistant is a conversational agent that helps you with tasks.
        </p>
      </div>
      <div className='flex gap-4'>
        <div className='flex items-center gap-2'>
          <Share size='16' color='#000000' />
          <p>Share</p>
        </div>
        <button
          className='rounded-xl bg-[#4F2682] p-2.5 w-fit hover:bg-[#391b5d]'
          onClick={() => createNewSession()}
        >
          <Edit2 size='16' color='#FFFFFF' />
        </button>
      </div>
    </section>
  )
}

export default Topbar
