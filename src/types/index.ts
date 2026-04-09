import { User } from "@prisma/client";
import z from "zod";
import { UserInfo, userIdSchema, usersFoundInSearch, userDataSchema, chatSchema } from "../schema-zod";

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
    };
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
    newMessage: {
        id: number,
        content: string,
        createdAt: Date,
        chatId: number,
        senderId: number
    } | null
}
