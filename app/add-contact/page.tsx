import UserSearch from '@/components/add-contact/UserSearch'
import OnlineUsers from '@/components/OnlineUsers'

export default function addContact() {
  return (
    <div className='flex flex-col lg:grid lg:grid-cols-[40%_60%] h-full items-center mt-3 sm:mt-5 gap-4 lg:gap-0'>
      <div className='w-full'>
        <OnlineUsers />
      </div>

      <UserSearch />
    </div>
  )
}
