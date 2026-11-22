'use client'
import { useStore } from '@/src/store'
import DropDownMenu from './DropDownMenu'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import PopOverNotification from './ui/PopOverNotification'
import socket from '@/src/lib/socket'
import { FriendOnline, FriendsOnlineId, Message } from '@/src/types'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/16/solid'

export default function Header() {
  // State
  const userData = useStore((state) => state.userData)
  const token = useStore((state) => state.token)
  const setToken = useStore((state) => state.setToken)
  const getUserData = useStore((state) => state.getUserData)
  const userId = useStore((state) => state.userData.id)
  const friends = useStore((state) => state.userData.friends)
  const updateOnlineFriends = useStore((state) => state.updateOnlineFriends)
  const updateFriendOnline = useStore((state) => state.updateFriendOnline)
  const updateUserDisconnected = useStore((state) => state.updateUserDisconnected)
  const updateUserConnected = useStore((state) => state.updateUserConnected)
  const updateFriendRemovedNotification = useStore((state) => state.updateFriendRemovedNotification)
  const updateNewMessageReceived = useStore((state) => state.updateNewMessageReceived)

  const router = useRouter()
  const friendsId = friends.map(friend => friend.id)

  // ------------------------//---------- Websockets ---------------//------------
  useEffect(() => {
    // Verificamos si ya cargo el server de Next
    if (typeof window === "undefined") return

    // Ejcutamos sockets
    if (userId) {
      socket.connect()
      socket.emit('register-user', { userId, friendsId })
    } else {
      socket.disconnect()
    }

    // Register socket listeners
    socket.on('update-notifications', () => { getUserData() })
    socket.on('request-accepted-notification', (dataFriend: FriendOnline) => { updateFriendOnline(dataFriend) })
    socket.on('friends-online', (friendsOnline: FriendsOnlineId) => { updateOnlineFriends(friendsOnline) })
    socket.on('friend-connected', (friendId: FriendOnline['id']) => { updateUserConnected(friendId) })
    socket.on('friend-removed-notification', (friendId: FriendOnline['id']) => { updateFriendRemovedNotification(friendId) })
    socket.on('friend-disconnected', (userDisconnected: FriendOnline['id']) => { updateUserDisconnected(userDisconnected) })
    // Update New Message Received
    socket.on('new-message', (newMessage: Message) => { updateNewMessageReceived(newMessage) })

    // Cleanup: remover listeners al re-ejecutar el efecto o desmontar
    return () => {
      socket.off('update-notifications')
      socket.off('request-accepted-notification')
      socket.off('friends-online')
      socket.off('friend-connected')
      socket.off('friend-removed-notification')
      socket.off('friend-disconnected')
      socket.off('new-message')
    }
  }, [userId])

  // ------ Check exists a session saved ----------
  useEffect(() => {
    const existsToken = localStorage.getItem('token')
    if (!existsToken) {
      router.push('/')
      return
    }
    setToken(existsToken)
    getUserData()
  }, [token])

  return (
    <header className="flex items-center justify-between bg-slate-800 dark:bg-gray-950 px-3 py-3 sm:px-6 sm:py-4 shadow-lg flex-shrink-0">
      <Link href={'/dashboard'} className="flex items-center gap-2 hover:scale-101 transition">
        <ChatBubbleLeftRightIcon className="w-7 h-7 text-indigo-400" />
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-white">
          ChatApp
        </h1>
      </Link>
      {userData.email && (
        <div className="flex items-center gap-2 sm:gap-5">
          <PopOverNotification />
          <p className="text-white font-semibold hidden sm:block text-sm">
            Hello, <span className="font-black">{userData.name}</span>!
          </p>
          <DropDownMenu />
        </div>
      )}
    </header>
  )
}
