'use client'
import React from 'react'
import ChatInfo from './ChatInfo'
import { useStore } from '@/src/store'

export default function Chats() {

    const friendsOnline = useStore((state) => state.friendsOnline)

    return (
        <div>
            <ul className="flex flex-col gap-3 max-h-[80%] overflow-y-auto" >
                {friendsOnline.map(friend => (
                    <ChatInfo
                        key={friend.id}
                        friendInfo={friend}
                    />
                ))}
            </ul>
        </div>
    )
}
