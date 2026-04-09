"use client"
import { LightBulbIcon, PaperAirplaneIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'
import Chats from './Chats'
import { newMessageAction } from '@/actions/newMessageAction'
import { useStore } from '@/src/store'
import { useEffect, useRef } from 'react'
import { getOrCreateChat } from '@/actions/getOrCreateChat'
import { toast } from 'react-toastify'
import { chatSchema, messageSchema } from '@/src/schema-zod'
import { useActionState } from 'react'
import { MessageFormState } from '@/src/types'

export default function ChatsPanel() {
    const userId = Number(useStore((state) => state.userData.id))
    const idFriendCurrentChat = useStore((state) => state.idFriendCurrentChat)
    const setCurrentChat = useStore((state) => state.setCurrentChat)
    const currentChat = useStore((state) => state.currentChat)
    const updateMessageCurrentChat = useStore((state) => state.updateMessageCurrentChat)

    const messagesRef = useRef<HTMLDivElement | null>(null)
    const formRef = useRef<HTMLFormElement | null>(null)

    const initialMessageFormState: MessageFormState = {
        error: '',
        success: false,
        newMessage: null
    }

    const [state, formAction] = useActionState(newMessageAction, initialMessageFormState)
    // Escuchamos cambios en el state apra poder mostrar lo que va ocurriendo
    useEffect(() => {
        const result = messageSchema.safeParse(state.newMessage)
        if (!result.success) {
            return
        }
        updateMessageCurrentChat(result.data)
    }, [state])


    useEffect(() => {
        if (!idFriendCurrentChat) return
        // Obtenemos el chat
        async function getChat() {
            const chat = await getOrCreateChat(userId, idFriendCurrentChat)
            const result = chatSchema.safeParse(chat)
            if (!result.success) {
                toast.error('Hubo un error al tratar de obtener el chat, intentalo nuevamente')
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


    return (
        <div className="grid grid-cols-[2fr_1fr] mt-5 bg-white w-165 h-125 mb-30 mr-10 rounded-lg shadow-2xl">
            <div className="flex flex-col p-4 h-130">
                <div className="bg-slate-200 w-full h-117 p-7 pt-5 rounded-md flex flex-col">
                    <div className="messages h-full overflow-auto mb-3" ref={messagesRef}>
                        {currentChat.messages.map(msg => (
                            <div
                                className='flex mr-3 mb-0.5'
                                key={msg.id}
                            >
                                <div
                                    className={`px-3 py-2 rounded-lg max-w-[70%] ${msg.senderId === userId
                                        ? "bg-indigo-500 text-white ml-auto"
                                        : "bg-gray-200 text-black"
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    <span className="text-[10px] opacity-60 block">
                                        {new Date(msg.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form ref={formRef} action={formAction} className="flex items-end gap-2">
                        <textarea
                            name='content'
                            className="w-full bg-slate-100 rounded-md resize-none px-3 py-1 min-h-[38px] max-h-[100px] focus:outline-none border border-gray-200 focus:border-slate-300 shadow-xl"
                            rows={1}
                            onInput={autoResize}
                            onKeyDown={(e) => {
                                // Enter para enviar
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    formRef.current?.requestSubmit()
                                }
                            }}
                        ></textarea>
                        <input type="hidden" name='senderId' value={userId} />
                        <input type="hidden" name='chatId' value={currentChat.id} />
                        <button
                            className='w-12'
                            type="submit"
                        >
                            <PaperAirplaneIcon
                                className='text-indigo-700 hover:scale-106 hover:text-indigo-800 cursor-pointer transition'
                            />
                        </button>
                    </form>
                </div>
            </div>

            <div className='mt-3 h-120'>
                <h3 className="font-black text-center mt-5 text-2xl gap-2 mb-5 text-shadow-md">Historial</h3>
                <ul className='mt-5 h-110 overflow-auto'>
                    <Chats />
                </ul>
            </div>
        </div>
    )
}
