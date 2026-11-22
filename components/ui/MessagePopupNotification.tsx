'use client'
import { useEffect } from 'react'
import { useStore } from '@/src/store'
import { IncomingNotification } from '@/src/types'
import { useRouter } from 'next/navigation'
import { XMarkIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/16/solid'

function NotificationItem({ notification }: { notification: IncomingNotification }) {
    const dismissIncomingNotification = useStore((state) => state.dismissIncomingNotification)
    const setCurrentIdFriendChat = useStore((state) => state.setCurrentIdFriendChat)
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            dismissIncomingNotification(notification.id)
        }, 7000)
        return () => clearTimeout(timer)
    }, [notification.id, dismissIncomingNotification])

    const handleClick = () => {
        setCurrentIdFriendChat(notification.senderId)
        router.push('/dashboard')
        dismissIncomingNotification(notification.id)
    }

    const photo = notification.senderImage || '/profile.jpg'

    return (
        <div
            onClick={handleClick}
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-gray-700 shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 cursor-pointer group"
            role="alert"
        >
            <div className="relative flex-shrink-0">
                <img
                    src={photo}
                    alt={notification.senderName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 dark:border-gray-600 group-hover:scale-105 transition"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
            </div>

            <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="font-black text-sm text-slate-800 dark:text-white truncate">
                        {notification.senderName}
                    </p>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 flex-shrink-0">
                        <ChatBubbleLeftEllipsisIcon className="w-3 h-3" />
                        New
                    </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {notification.content}
                </p>
            </div>

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    dismissIncomingNotification(notification.id)
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition flex-shrink-0"
                title="Close notification"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    )
}

export default function MessagePopupNotification() {
    const incomingNotifications = useStore((state) => state.incomingNotifications)

    if (!incomingNotifications || incomingNotifications.length === 0) return null

    return (
        <aside
            aria-label="New message notifications"
            className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] sm:w-80 pointer-events-none"
        >
            {incomingNotifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} />
            ))}
        </aside>
    )
}
