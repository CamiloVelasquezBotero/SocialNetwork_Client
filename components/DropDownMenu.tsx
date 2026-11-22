'use client'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ChevronDownIcon,
  ArrowLeftEndOnRectangleIcon,
  PencilSquareIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/16/solid'
import { useStore } from '@/src/store'
import { useRouter } from 'next/navigation'

export default function DropDownMenu() {
  const logOut = useStore((state) => state.logOut)
  const toggleDarkMode = useStore((state) => state.toggleDarkMode)
  const darkMode = useStore((state) => state.darkMode)
  const userData = useStore((state) => state.userData)
  const router = useRouter()

  const handleLogOut = () => {
    logOut()
    router.push('/')
  }

  const profileImage = userData.profileImage || '/profile.jpg'

  return (
    <div>
      <Menu>
        <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm/6 font-semibold text-white shadow-lg border-slate-700 shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700 cursor-pointer transition-all">
          <img
            src={profileImage}
            alt="Profile photo"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-500"
          />
          <ChevronDownIcon className="size-4 fill-white/60" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-48 pb-4 origin-top-right rounded-xl bg-slate-700 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 z-50"
        >
          <div className="my-1 h-px bg-white/5" />

          {/* Go to settings */}
          <MenuItem>
            <button
              className="transition group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 cursor-pointer"
              onClick={() => router.push('/settings')}
            >
              <PencilSquareIcon className="size-5 fill-white/60" />
              Edit Profile
            </button>
          </MenuItem>

          {/* Toggle light/dark mode */}
          <MenuItem>
            <button
              className="transition group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 cursor-pointer"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <SunIcon className="size-5 fill-yellow-300" />
              ) : (
                <MoonIcon className="size-5 fill-white/60" />
              )}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </MenuItem>

          <div className="my-1 h-px bg-white/5" />

          {/* Log out */}
          <MenuItem>
            <button
              className="transition group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 cursor-pointer text-red-300"
              onClick={handleLogOut}
            >
              <ArrowLeftEndOnRectangleIcon className="size-5 fill-red-300" />
              Log Out
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  )
}
