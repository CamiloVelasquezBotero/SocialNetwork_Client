import { UsersFoundInSearch } from "@/src/types"
import User from "./User"

type FoundUsersProps = {
  users: UsersFoundInSearch
}

export default function FoundUsers({ users }: FoundUsersProps) {
  return (
    <>
        {users.length ? (
          <ul className="flex flex-col gap-1.5 h-auto max-h-[380px] lg:h-95 overflow-y-auto p-1 shadow-inner w-full px-1">
            {users.map((user) => (
                <User
                  key={user.email}
                  user={user}
                />
            ))}
          </ul>
        ) : (
          <p className="font-bold text-base sm:text-xl text-slate-500 dark:text-slate-400 mt-10 text-center">
            No contacts found
          </p>
        )}
    </>
  )
}
