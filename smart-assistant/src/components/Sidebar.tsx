import { Logout as LogoutIcon, User } from 'iconsax-react'
import ChatHistory from './ChatHistory'
import { getAllChatSessions } from '../helpers/helpers'

const Sidebar = ({ handleSessionRestore }) => {
    return (
        <div className='w-[24rem] max-h-full bg-[#F4F4F4] flex flex-col item-start rounded-3xl'>
            <div className='w-full flex items-center justify-center py-6'>
                <h1 className='text-black font-bold text-lg'>Chat History</h1>
            </div>
            <div className='w-5/6 flex justify-center mx-auto border-t border-[#e9e9e921]' />
            <div className='flex flex-col justify-between gap-2 h-[90%] w-full pt-3'>
                <div className='flex-1 flex flex-col items-start gap-2 p-2 w-full overflow-y-auto'>
                    {getAllChatSessions().length > 0 &&
                        getAllChatSessions()
                            .sort((a, b) => b.id - a.id)
                            .map((item) => (
                                <ChatHistory
                                    key={item.id}
                                    item={item}
                                    handleSessionRestore={handleSessionRestore}
                                />
                            ))}
                </div>
                <div className='flex items-center justify-between gap-6 px-6 py-2.5 mb-8 rounded-full bg-white w-5/6 mx-auto'>
                    <div className='flex items-end gap-2'>
                        <User size={24} color='#4F2682' variant='Bulk' className='' />
                        <p className='font-medium text-sm'>Current User</p>
                    </div>
                    <button className='border rounded-full p-2 hover:bg-[#4F2682] hover:text-white'>
                        <LogoutIcon variant='Outline' size='24' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
