'use server'
import { prisma } from "@/src/prisma-connection/prisma";
import { dataSendRequest } from "@/src/schema-zod";

export async function sendFriendRequestAction(data: unknown) {
    const result = dataSendRequest.safeParse(data)
    if (!result.success) {
        return { errors: 'Error sending request, please contact support' }
    }

    try {
        const userExists = await prisma.user.findFirst({
            where: { id: result.data.userId },
            select: { id: true, requestsReceived: true, friends: true },
        })
        if (!userExists) {
            return { errors: 'User not found, please contact support' }
        }
        const alreadyFriends = userExists.friends.some(friend => friend.id === result.data.currentUserid)
        if (alreadyFriends) {
            return { errors: 'This user is already in your friends list' }
        }
        const alreadyExists = userExists.requestsReceived.some(request => request.id === result.data.currentUserid)
        if (alreadyExists) {
            return { errors: 'Friend request already sent' }
        }

        // Adding user
        await prisma.user.update({
            where: { id: userExists.id },
            data: {
                requestsReceived: {
                    connect: { id: result.data.currentUserid }
                }
            }
        })
    } catch (error) {
        console.log(`Error adding user: ${error}`)
        return { errors: 'Error sending request, please try again' }
    }
}
