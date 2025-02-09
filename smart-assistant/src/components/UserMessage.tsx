import { User } from 'iconsax-react'

const UserMessage = ({ text }) => {
    return (
        <div className='w-2/3 flex gap-2 relative'>
            <User size={24} color='#4F2682' variant='Bulk' className='absolute top-3 -right-8' />
            <div className='border rounded-lg p-2.5 flex-1'>
                <p>{text ?? "No text added"}</p>
            </div>
        </div>
    )
}

export default UserMessage