import { useStore } from '@/src/store'
import { FriendOnline } from '@/src/types'
import { ChatBubbleLeftRightIcon, LightBulbIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'

type OnlineFriendInfoProps = {
    friendInfo: FriendOnline
}

export default function OnlineFriendInfo({ friendInfo }: OnlineFriendInfoProps) {
    const setCurrentIdFriendChat = useStore((state) => state.setCurrentIdFriendChat)

    return (
        <li className="w-[62%] p-2 bg-slate-300 rounded-full shadow-xl">
            <div className="flex gap-5 items-center justify-center">
                <LightBulbIcon className="size-5  text-green-400" />
                <Image
                    src={'/pruebaUser.jpg'}
                    width={40}
                    height={40}
                    alt="User Image"
                    className="rounded-full"
                />
                <p className="text-xl font-bold">{friendInfo.name}</p>

                <button onClick={() => setCurrentIdFriendChat(friendInfo.id)}>
                    <ChatBubbleLeftRightIcon
                        className="shadow-xl text-white rounded-xl bg-blue-500 p-2 w-9 hover:bg-blue-400 transition cursor-pointer"
                    />
                </button>
            </div>
        </li>
    )
}
