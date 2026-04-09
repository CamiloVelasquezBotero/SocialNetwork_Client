"use server"

import { prisma } from "@/src/prisma-connection/prisma"
import { MessageFormState } from "@/src/types"

export async function newMessageAction(prevState:any, formData:FormData):Promise<MessageFormState> {
    const content = String(formData.get('content'))
    const senderId = Number(formData.get('senderId'))
    const chatId = Number(formData.get('chatId'))
    
    if(!content || !senderId || !chatId) {
        return {error: 'Invalid Data', newMessage: null, success: false}
    }

    try {
        const newMessage = await prisma.message.create({
            data: {
                content,
                senderId,
                chatId
            },
            include: {
                sender: {
                    select: { id:true, name:true, email:true }
                }
            }
        })
        return { success: true, newMessage: newMessage, error: '' }
    } catch (error) {
        console.log(`There was an error trying to send the message: ${error}`)
        return {error: 'Hubo un error al enviar el mensaje, intenta de nuevo', newMessage: null, success: false}
    }
}