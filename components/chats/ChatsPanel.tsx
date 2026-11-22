"use client"
import { PaperAirplaneIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/16/solid'
import Chats from './Chats'
import { newMessageAction } from '@/actions/newMessageAction'
import { useStore } from '@/src/store'
import { useEffect, useRef } from 'react'
import { getOrCreateChat } from '@/actions/getOrCreateChat'
import { toast } from 'react-toastify'
import { chatSchema } from '@/src/schema-zod'
import { Message } from '@/src/types'

export default function ChatsPanel() {
    const userId = Number(useStore((state) => state.userData.id))
    const userData = useStore((state) => state.userData)
    const idFriendCurrentChat = useStore((state) => state.idFriendCurrentChat)
    const setCurrentChat = useStore((state) => state.setCurrentChat)
    const currentChat = useStore((state) => state.currentChat)
    const updateMessageCurrentChat = useStore((state) => state.updateMessageCurrentChat)
    const confirmMessageSent = useStore((state) => state.confirmMessageSent)
    const friendsOnline = useStore((state) => state.friendsOnline)
    const setCurrentIdFriendChat = useStore((state) => state.setCurrentIdFriendChat)

    const friendCurrentChat = friendsOnline.find(f => f.id === idFriendCurrentChat)

    const messagesRef = useRef<HTMLDivElement | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    // Escuchamos cambios en el state apra poder mostrar lo que va ocurriendo
    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!textareaRef.current) return

        const content = textareaRef.current.value.trim()
        if (!content || !userId || !currentChat.id || !idFriendCurrentChat) return

        // 1. Immediately clear textarea
        textareaRef.current.value = ''
        textareaRef.current.style.height = 'auto'

        // 2. Optimistic message
        const tempId = -Date.now()
        const optimisticMessage: Message = {
            id: tempId,
            content,
            senderId: userId,
            createdAt: new Date(),
            sender: {
                id: userId,
                name: userData.name,
                email: userData.email,
                profileImage: userData.profileImage,
            }
        }

        // 3. Immediately display and emit
        updateMessageCurrentChat(optimisticMessage)

        // 4. Save to database in background
        try {
            const formData = new FormData()
            formData.append('content', content)
            formData.append('senderId', String(userId))
            formData.append('chatId', String(currentChat.id))

            const response = await newMessageAction(null, formData)
            if (response.success && response.newMessage) {
                confirmMessageSent(tempId, response.newMessage)
            }
        } catch (error) {
            console.error('Error saving message to database:', error)
        }
    }

    // Load or create chat
    useEffect(() => {
        if (!idFriendCurrentChat) return
        // Obtenemos el chat
        async function getChat() {
            const chat = await getOrCreateChat(userId, idFriendCurrentChat)
            const result = chatSchema.safeParse(chat)
            if (!result.success) {
                toast.error('There was an error getting the chat, please try again')
                return
            }
            // Establecemos el chat en el store
            setCurrentChat(result.data)
        }
        getChat()
    }, [idFriendCurrentChat])

    // Hacemos scroll hacia abajo cada vez que se envie un mensaje
    useEffect(() => {
        if (!messagesRef.current) return
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }, [currentChat.messages])

    const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'auto'
        e.target.style.height = e.target.scrollHeight + 'px'
    }

    const friendPhoto = friendCurrentChat?.profileImage || '/profile.jpg'

    return (
        <div className="flex h-full w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200/80 dark:border-gray-700">

            {/* ========== Main chat panel ========== */}
            <div className="flex flex-col flex-1 h-full min-w-0">

                {/* Chat header */}
                <div className="flex items-center gap-2.5 px-3.5 py-3 bg-indigo-700 dark:bg-indigo-900 shadow-md flex-shrink-0">
                    <button
                        className="md:hidden text-white/80 hover:text-white p-1 rounded-lg transition"
                        onClick={() => setCurrentIdFriendChat(0)}
                        title="Back to contacts"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>

                    <img
                        src={friendPhoto}
                        alt="Contact photo"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/40 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="font-black text-white text-sm sm:text-base truncate">{friendCurrentChat?.name || 'Contact'}</p>
                        <p className="text-indigo-200 text-xs">Online</p>
                    </div>

                    <button
                        className="text-white/70 hover:text-white transition cursor-pointer p-1 rounded-lg hover:bg-white/10 flex-shrink-0"
                        onClick={() => setCurrentIdFriendChat(0)}
                        title="Close chat"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages area */}
                <div className="flex flex-col flex-1 min-h-0 bg-slate-100 dark:bg-gray-700/60 p-3 sm:p-4">
                    <div
                        className="flex-1 overflow-y-auto pr-1"
                        ref={messagesRef}
                    >
                        {currentChat.messages.length === 0 && (
                            <p className="text-center text-slate-400 dark:text-slate-500 mt-10 text-sm">
                                No messages yet. Send the first one!
                            </p>
                        )}
                        {currentChat.messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`flex mb-2 ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.senderId !== userId && (
                                    <img
                                        src={friendPhoto}
                                        alt="Avatar"
                                        className="w-7 h-7 rounded-full object-cover mr-2 self-end flex-shrink-0"
                                    />
                                )}
                                <div
                                    className={`px-3.5 py-2 rounded-2xl max-w-[85%] sm:max-w-[70%] shadow-sm text-sm ${
                                        msg.senderId === userId
                                            ? 'bg-indigo-600 text-white rounded-br-xs'
                                            : 'bg-white dark:bg-gray-600 dark:text-white text-gray-800 border border-gray-200 dark:border-gray-500 rounded-bl-xs'
                                    }`}
                                >
                                    <p className="break-words leading-relaxed">{msg.content}</p>
                                    <span className="text-[10px] opacity-60 block mt-0.5 text-right">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message form */}
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2 flex-shrink-0 pt-2.5 mt-1 border-t border-slate-200 dark:border-gray-600">
                        <textarea
                            ref={textareaRef}
                            name='content'
                            className="w-full bg-white dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 rounded-xl resize-none px-3 py-2 min-h-[40px] max-h-[90px] focus:outline-none border border-gray-200 dark:border-gray-500 focus:border-indigo-400 shadow-sm transition text-sm"
                            rows={1}
                            placeholder="Type a message..."
                            onInput={autoResize}
                            onKeyDown={(e) => {
                                // Enter para enviar
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSendMessage()
                                }
                            }}
                        />
                        <button
                            type="submit"
                            className="flex-shrink-0 p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition cursor-pointer shadow-md hover:scale-105 active:scale-95 text-white"
                            title="Send message"
                        >
                            <PaperAirplaneIcon className='w-5 h-5' />
                        </button>
                    </form>
                </div>
            </div>

            {/* ========== Right Contacts sidebar (wide screens only) ========== */}
            <div className="hidden xl:flex w-52 border-l border-slate-200 dark:border-gray-700 flex-col h-full flex-shrink-0 bg-white dark:bg-gray-800">
                <h3 className="font-black text-center py-3 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-gray-700 flex-shrink-0">
                    Contacts
                </h3>
                <div className="flex-1 overflow-y-auto p-2">
                    <Chats />
                </div>
            </div>
        </div>
    )
}
