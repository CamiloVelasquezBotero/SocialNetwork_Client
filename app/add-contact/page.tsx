import UserSearch from '@/components/add-contact/UserSearch'
import OnlineUsers from '@/components/OnlineUsers'

export default function AddContact() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] min-h-[calc(100vh-70px)] gap-4 p-3 sm:p-5 dark:bg-gray-900">
      {/* Left panel: online contacts */}
      <div className="w-full">
        <OnlineUsers />
      </div>

      {/* Right panel: user search */}
      <UserSearch />
    </div>
  )
}
