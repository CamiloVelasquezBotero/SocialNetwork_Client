'use client'
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, ChatBubbleLeftRightIcon, UserGroupIcon } from '@heroicons/react/16/solid';
import OnlineUsers from "@/components/OnlineUsers";
import { useStore } from "@/src/store";
import ChatsPanel from "@/components/chats/ChatsPanel";

export default function DashBoard() {
  const idFriendCurrentChat = useStore((state) => state.idFriendCurrentChat)
  const router = useRouter()
  const userData = useStore((state) => state.userData)

  if (!userData.email) return null

  return (
    <div className="flex h-full w-full overflow-hidden p-2 sm:p-3 gap-3">
      
      {/* ===== Left column: online contacts & buttons ===== */}
      <div className={`flex flex-col gap-2.5 w-full md:w-64 lg:w-72 flex-shrink-0 h-full ${
        idFriendCurrentChat ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="flex-1 min-h-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-slate-200/80 dark:border-gray-700 overflow-hidden flex flex-col">
          <OnlineUsers />
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 transition-all bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-md"
            onClick={() => router.push('/add-contact')}
            title="Search and add contacts"
          >
            <MagnifyingGlassIcon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Search</span>
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 transition-all bg-cyan-800 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-md"
            onClick={() => router.push('/contact-list')}
            title="View my contacts list"
          >
            <UserGroupIcon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Contacts</span>
          </button>
        </div>
      </div>

      {/* ===== Right column: chat panel or welcome placeholder ===== */}
      <div className={`flex-1 min-w-0 h-full ${
        !idFriendCurrentChat ? 'hidden md:flex' : 'flex'
      }`}>
        {idFriendCurrentChat ? (
          <ChatsPanel />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-slate-200/80 dark:border-gray-700 text-center p-6">
            <ChatBubbleLeftRightIcon className="w-16 h-16 text-indigo-500/50 mb-4" />
            <p className="font-black text-xl sm:text-2xl text-slate-600 dark:text-slate-300">
              Select an{' '}
              <span className="text-indigo-700 dark:text-indigo-400">online contact</span>{' '}
              to start chatting
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
