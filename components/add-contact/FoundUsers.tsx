import { UsersFoundInSearch } from "@/src/types"
import User from "./User"

type FoundUsersProps = {
  users: UsersFoundInSearch
}

export default function FoundUsers({users}:FoundUsersProps) {
  return (
    <>
        {users.length ? (
          <ul className="flex flex-col gap-1 h-auto max-h-[380px] lg:h-95 overflow-y-auto p-1 shadow-xl w-full px-2 sm:px-4">
            {users.map((user) => (
                <User
                  key={user.email}
                  user={user}
                />
            ))}
          </ul>
        ) : (
          <p className="font-bold text-lg sm:text-2xl text-slate-600 mt-10 text-center">No se encontraron usuarios similares</p>
        )}
    </>
  )
}
