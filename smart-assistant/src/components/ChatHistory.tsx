import { Flash as FlashIcon } from 'iconsax-react'

const ChatHistory = ({ item, handleSessionRestore }) => {
  return (
    <div
      className='flex items-center gap-4 px-4 py-3 rounded-lg bg-purple w-full hover:bg-[#391b5d]'
      onClick={() => handleSessionRestore(item.id, item.messages)}
    >
      <FlashIcon size='28' color='#FFFFFF' variant='Bulk' />
      <p className='text-black'>{item.messages[0].content.substring(0, 30)}</p>
    </div>
  )
}

export default ChatHistory
