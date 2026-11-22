import { create } from 'zustand';
import { AcceptRequest, CurrentChat, FriendOnline, FriendsOnline, FriendsOnlineId, IncomingNotification, Message, UserData } from './types';
import api from './lib/axios';
import { acceptRequestSchema, rejectRequestSchema, removeFriendSchema, userDataSchema, userIdSchema } from './schema-zod';
import { toast } from 'react-toastify';
import { sendFriendRequestAction } from '@/actions/sendFriendRequestAction';
import socket from './lib/socket';

const initialValues = {
    token: '',
    darkMode: false,
    userData: {
        id: 0,
        name: '',
        email: '',
        profileImage: null as string | null | undefined,
        friends: [],
        requestsSent: [],
        requestsReceived: []
    },
    friendsOnline: [],
    idFriendCurrentChat: 0,
    currentChat: {
        createdAt: new Date(),
        id: 0,
        messages: [],
        users: []
    },
    incomingNotifications: [] as IncomingNotification[]
}

interface Store {
    token: string,
    darkMode: boolean,
    userData: UserData,
    friendsOnline: FriendsOnline,
    idFriendCurrentChat: FriendOnline['id'],
    currentChat: CurrentChat,
    incomingNotifications: IncomingNotification[],

    setToken: (token: string) => void,
    toggleDarkMode: () => void,
    getUserData: () => void,
    logOut: () => void,
    updateProfileImage: (profileImage: string) => void,
    sendFriendRequest: (id: UserData['id']) => void,
    acceptRequest: (dataRequest: AcceptRequest) => void,
    removeFriend: (friendId: UserData['id']) => void,
    updateOnlineFriends: (friendsOnline: FriendsOnlineId) => void,
    updateUserDisconnected: (friendId: FriendOnline['id']) => void,
    updateUserConnected: (friendId: FriendOnline['id']) => void,
    updateFriendOnline: (dataFriend: FriendOnline) => void,
    updateFriendRemovedNotification: (friendId: FriendOnline['id']) => void,
    setCurrentIdFriendChat: (chatId: number) => void,
    setCurrentChat: (chatId: CurrentChat) => void,
    updateMessageCurrentChat: (newMessage: Message) => void,
    confirmMessageSent: (tempId: number, realMessage: Message) => void,
    updateNewMessageReceived: (newMessage: Message) => void,
    dismissIncomingNotification: (id: string) => void,
}

export const useStore = create<Store>((set, get) => ({
    token: initialValues.token,
    darkMode: false,
    userData: initialValues.userData,
    friendsOnline: initialValues.friendsOnline,
    idFriendCurrentChat: initialValues.idFriendCurrentChat,
    currentChat: initialValues.currentChat,
    incomingNotifications: initialValues.incomingNotifications,

    setToken: (token) => {
        set(() => ({
            token: token
        }))
    },

    // Alterna entre modo claro y oscuro
    toggleDarkMode: () => {
        const newDarkMode = !get().darkMode
        set(() => ({ darkMode: newDarkMode }))
        // Guardamos la preferencia en localStorage
        localStorage.setItem('darkMode', String(newDarkMode))
        // Aplicamos la clase al <html>
        if (newDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    },

    getUserData: async () => {
        const token = get().token
        const url = '/api/user'
        try {
            const { data } = await api.get(url, { headers: { Authorization: `Bearer ${token}` } })
            const result = userDataSchema.safeParse(data)
            if (result.success) {
                set(() => ({
                    userData: {
                        id: result.data.id,
                        name: result.data.name,
                        email: result.data.email,
                        profileImage: result.data.profileImage,
                        friends: result.data.friends,
                        requestsSent: result.data.requestsSent,
                        requestsReceived: result.data.requestsReceived,
                    }
                }))
            }

        } catch (error) {
            console.log('There was an error getting user Data', error)
        }
    },

    logOut: () => {
        localStorage.removeItem('token')
        set(() => ({
            token: initialValues.token,
            userData: initialValues.userData
        }))
    },

    // Actualiza la foto de perfil en el store sin tener que recargar datos
    updateProfileImage: (profileImage) => {
        set((state) => ({
            userData: {
                ...state.userData,
                profileImage
            }
        }))
    },

    sendFriendRequest: async (id) => {
        const currentUserid = get().userData.id
        const result = userIdSchema.safeParse(id)
        if (!result.success) {
            toast.error('There was an error sending the request, please contact support')
        }

        const data = { userId: id, currentUserid }
        try {
            const response = await sendFriendRequestAction(data)
            if (response?.errors) {
                toast.error(response.errors)
                return false
            }
            toast.success('Friend Request sent successfully')
            socket.emit('friend-request-sent', { idReceiver: id })
        } catch (error) {
            console.log('There was an error trying to send friend request: ' + error)
        }
    },

    acceptRequest: async (dataRequest) => {
        const token = get().token
        const url = '/api/user'
        try {
            const { data } = await api.patch(url, dataRequest, { headers: { Authorization: `Bearer ${token}` } })
            if (dataRequest.action === 'accept') {
                // ACCEPT
                const result = acceptRequestSchema.safeParse(data)
                if (!result.success) {
                    toast.error('There was an error')
                    return
                }

                // Actualizar Store
                set((state) => ({
                    userData: {
                        ...state.userData,
                        friends: result.data?.user.friends,
                        requestsReceived: result.data?.user.requestsReceived
                    }
                }))
                toast.success(result.data.message)
                // Enviamos socket para actualizar al que envio la solicitud
                socket.emit('friend-request-accepted', {
                    userData: {
                        id: get().userData.id,
                        name: get().userData.name,
                        email: get().userData.email,
                    },
                    idSender: dataRequest.idSender,
                    action: dataRequest.action
                }, (isConnected: boolean) => {
                    if (isConnected) {
                        // Actualizamos friendsOnline
                        const newFriendAdded = result.data.user.friends.find(friend => friend.id === dataRequest.idSender)
                        if (newFriendAdded) {
                            set((state) => ({
                                friendsOnline: [...state.friendsOnline, newFriendAdded]
                            }))
                        }
                    }
                })
            } else {
                // DECLINE
                const result = rejectRequestSchema.safeParse(data)
                if (!result.success) {
                    toast.error('There was an error')
                    return
                }
                // Actualizar Store
                set((state) => ({
                    userData: {
                        ...state.userData,
                        requestsReceived: result.data?.user.requestsReceived
                    }
                }))
                toast.success(result.data.message)
            }
        } catch (error) {
            console.log(`There was an error accepting the request: ${error}`)
        }
    },

    removeFriend: async (friendId) => {
        const token = get().token
        const url = `/api/user?friendId=${friendId}`

        try {
            const { data } = await api.delete(url, { headers: { Authorization: `Bearer ${token}` } })
            const result = removeFriendSchema.safeParse(data)
            if (!result.success) {
                toast.error('There was an error')
                return
            }

            // Actualizar Store
            const friendsOnlineUpdated = get().friendsOnline.filter(friend => friend.id != friendId)
            set((state) => ({
                userData: {
                    ...state.userData,
                    friends: result.data?.user.friends
                },
                friendsOnline: friendsOnlineUpdated
            }))
            toast.success(result.data.message)

            // Socket de eliminacion para actualizacion de estado en el otro usuario
            socket.emit('friend-removed', { userId: get().userData.id, userRemovedId: friendId })
        } catch (error) {
            console.log(`There was an error removing the friend: ${error}`)
            toast.error('There was an error')
        }
    },

    // TODO: Este socket se esta envindo a todos los usuarios conectados asi no sean amigos de esta persona, arreglar para enviar unicamente el socket a los amigos
    updateOnlineFriends: (friendsOnline) => {
        const friends = get().userData.friends
        const dataFriendsOnline = friends.filter(friend => friendsOnline.includes(friend.id))

        set(() => ({
            friendsOnline: dataFriendsOnline
        }))
    },

    updateUserDisconnected: (friendId) => {
        const friendsOnline = get().friendsOnline
        const friendsOnlineUpdated = friendsOnline.filter(friend => friend.id !== friendId)
        set(() => ({
            friendsOnline: friendsOnlineUpdated
        }))
    },

    updateUserConnected: async (friendId) => {
        const friends = get().userData.friends
        const friendsOnline = get().friendsOnline
        const existsFriend = friends.find(friend => friend.id === friendId)

        if (existsFriend) {
            const existsFriendConnected = friendsOnline.find(friend => friend.id === existsFriend.id)
            if (!existsFriendConnected) {
                const friendsOnlineUpdated = [...friendsOnline, existsFriend]
                set(() => ({
                    friendsOnline: friendsOnlineUpdated
                }))
            }
        }
    },

    updateFriendOnline: (dataFriend) => {
        const alreadyFriends = get().userData.friends.find(friend => friend.id === dataFriend.id)
        const alreadyOnline = get().friendsOnline.find(friend => friend.id === dataFriend.id)

        if (!alreadyFriends) {
            set((state) => ({
                userData: {
                    ...state.userData,
                    friends: [...state.userData.friends, dataFriend]
                }
            }))
            toast.success(`${dataFriend.name} just accepted your friend request!`)
            if (!alreadyOnline) {
                set((state) => ({
                    friendsOnline: [...state.friendsOnline, dataFriend]
                }))
            }
        }
    },

    updateFriendRemovedNotification: (friendId) => {
        set((state) => ({
            userData: {
                ...state.userData,
                friends: state.userData.friends.filter(friend => friend.id !== friendId)
            },
            friendsOnline: state.friendsOnline.filter(friend => friend.id !== friendId)
        }))
    },

    setCurrentIdFriendChat: (friendId) => {
        set(() => ({
            idFriendCurrentChat: friendId
        }))
    },

    setCurrentChat: (chat) => {
        set(() => ({
            currentChat: chat
        }))
    },

    updateMessageCurrentChat: (newMessage) => {
        const alreadyExists = get().currentChat.messages.some(msg => msg.id === newMessage.id)
        if (!alreadyExists) {
            set((state) => ({
                currentChat: {
                    ...state.currentChat,
                    messages: [...state.currentChat.messages, newMessage]
                }
            }))

            // Send the socket so we can update the other user
            const idReceiver = get().idFriendCurrentChat
            if (idReceiver) {
                socket.emit('new-message-sent', { newMessage, idReceiver })
            }
        }
    },

    // Confirm message when DB finishes saving
    confirmMessageSent: (tempId, realMessage) => {
        set((state) => ({
            currentChat: {
                ...state.currentChat,
                messages: state.currentChat.messages.map(msg => 
                    msg.id === tempId ? realMessage : msg
                )
            }
        }))
    },

    updateNewMessageReceived: (newMessage) => {
        const currentFriendId = get().idFriendCurrentChat;

        // If chat is currently open with sender:
        if (currentFriendId === newMessage.senderId) {
            const alreadyExists = get().currentChat.messages.some(msg => msg.id === newMessage.id)
            if (!alreadyExists) {
                set((state) => ({
                    currentChat: {
                        ...state.currentChat,
                        messages: [...state.currentChat.messages, newMessage]
                    }
                }))
            }
        } else {
            // If chat is not open with sender, trigger floating bottom-right notification
            const newNotification: IncomingNotification = {
                id: `${newMessage.id || Date.now()}-${Math.random()}`,
                senderId: newMessage.senderId,
                senderName: newMessage.sender.name,
                senderImage: newMessage.sender.profileImage,
                content: newMessage.content,
                createdAt: new Date(newMessage.createdAt)
            }

            set((state) => ({
                // Keep at most 3 latest notifications
                incomingNotifications: [
                    ...state.incomingNotifications.filter(n => n.senderId !== newMessage.senderId),
                    newNotification
                ].slice(-3)
            }))
        }
    },

    dismissIncomingNotification: (id) => {
        set((state) => ({
            incomingNotifications: state.incomingNotifications.filter(n => n.id !== id)
        }))
    }

}))
