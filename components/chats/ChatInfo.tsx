import { FriendOnline } from '@/src/types'
import { ChatBubbleLeftRightIcon, LightBulbIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'
import React from 'react'

type ChatInfoProps = {
    friendInfo: FriendOnline
}

export default function ChatInfo({ friendInfo }: ChatInfoProps) {

    return (
        <li className="w-[90%] p-3 bg-slate-300 rounded-full shadow-xl">
            <div className="flex gap-5 items-center justify-center">
                <Image
                    src={'/pruebaUser.jpg'}
                    width={40}
                    height={40}
                    alt="User Image"
                    className="rounded-full"
                />
                <p className="text-xl font-bold">{friendInfo.name}</p>
            </div>
        </li>
    )
}
