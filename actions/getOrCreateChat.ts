"use server"

import { prisma } from "@/src/prisma-connection/prisma";

export async function getOrCreateChat(userId: number, friendId: number) {
    if (!userId || !friendId) {
        return { error: 'Invalid Data' }
    }

    try {
        // Buscamos si existe el chat
        const chatExists = await prisma.chat.findFirst({
            where: {
                AND: [
                    { users: { some: { userId } } },
                    { users: { some: { userId: friendId } } }
                ]
            },
            include: {
                users: { 
                    include: { 
                        user: { select: { id:true, name:true, email:true } }
                    }
                },
                messages: {
                    include: { sender: true },
                    orderBy: { createdAt: 'asc' }
                }
            }
        })

        if (!chatExists) {
            // Si no existe creamos el nuevo chat
            let newChat = await prisma.chat.create({ data: {} })

            // Creamos los registros de la tabla pivote ChatUser para vincular al chat creado
            let chatUser = await prisma.chatUser.createMany({
                data: [
                    { chatId: newChat.id, userId },
                    { chatId: newChat.id, userId: friendId }
                ]
            })

            // Recargamso de nuevo el chat con los usuarios agregados para retornarlo con los datos ya listos
            const refreshedChat = await prisma.chat.findUnique({
                where: { id: newChat.id },
                include: {
                    users: { include: { user: true } },
                    messages: {
                        include: { sender: true },
                        orderBy: { createdAt: 'asc' }
                    }
                }
            })

            // Retornamos el nuevo chat
            return refreshedChat
        } else {
            return chatExists
        }
    } catch (error) {
        console.log('There was an error trying to get the chat')
        return {error: 'Hubo un error al tratar de obtener el chat'}
    }

}