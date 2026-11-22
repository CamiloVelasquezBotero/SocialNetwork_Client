import z from "zod";
import { UserInfo, userIdSchema, usersFoundInSearch, userDataSchema } from "../schema-zod";

export type UserData = z.infer<typeof userDataSchema>

export type UserId = z.infer<typeof userIdSchema>

export type UsersFoundInSearch = z.infer<typeof usersFoundInSearch>
export type UserInfo = z.infer<typeof UserInfo>

export type AcceptRequest = { idSender: number, action: string, }

export type FriendsOnlineId = number[]
export type FriendOnline = {
    id: number,
    name: string,
    email: string,
    profileImage?: string | null,
}
export type FriendsOnline = FriendOnline[]

export type Message = {
    id: number;
    content: string;
    senderId: number;
    createdAt: Date;
    sender: {
        id: number;
        name: string;
        email: string;
        profileImage?: string | null;
    };
};

export type IncomingNotification = {
    id: string;
    senderId: number;
    senderName: string;
    senderImage?: string | null;
    content: string;
    createdAt: Date;
};

export type CurrentChat = {
    createdAt: Date;
    id: number;
    messages: Message[];
    users: {
        id: number;
        chatId: number;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }[];
};


export type MessageFormState = {
    error: string,
    success: boolean,
    newMessage: (Message & { chatId: number }) | null
}

