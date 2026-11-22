'use client'
import { useEffect, useState } from "react";
import FoundUsers from "./FoundUsers";
import api from "@/src/lib/axios";
import { UsersFoundInSearch } from "@/src/types";
import { usersFoundInSearch } from "@/src/schema-zod";
import Spinner from "../ui/Spinner";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";

export default function UserSearch() {
    const [isLoading, setIsLoading] = useState(false)
    const [query, setQuery] = useState<string>('')
    const [users, setUsers] = useState<UsersFoundInSearch>([])

    const router = useRouter()

    useEffect(() => {
        if (!query.length) {
            setUsers([])
            return
        }
        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                const { data } = await api.get(`/api/add-contact?query=${query}`)
                const result = usersFoundInSearch.safeParse(data)
                if (!result.success) {
                    return toast.error("Error searching for contacts")
                }
                // Mostramos los usuarios
                setUsers(result.data)
            } catch {
                toast.error('Error searching for contacts')
            } finally {
                setIsLoading(false)
            }
        }

        const timer = setTimeout(fetchUsers, 400)
        return () => clearTimeout(timer)
    }, [query])

    return (
        <div className='bg-white dark:bg-gray-800 w-full max-w-3xl rounded-2xl min-h-[400px] lg:h-auto shadow-xl mx-auto lg:mx-0'>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 p-4 border-b border-slate-100 dark:border-gray-700">
                <button
                    className="flex items-center gap-1.5 shadow-md p-2 px-4 transition-all bg-cyan-900 hover:bg-cyan-800 text-white font-bold rounded-xl cursor-pointer w-fit text-sm"
                    onClick={() => router.push('/dashboard')}
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back
                </button>
                <p className="font-black text-xl sm:text-2xl dark:text-white">
                    Find a <span className="text-indigo-700 dark:text-indigo-400">Contact</span>
                </p>
            </div>

            <div className="p-4">
                <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4'>
                    <label
                        htmlFor="querySearch"
                        className='font-bold text-base sm:text-lg dark:text-slate-200 flex-shrink-0 self-center'
                    >
                        Email or Name:
                    </label>
                    <input
                        id='querySearch'
                        type="text"
                        placeholder="Type contact's email or name"
                        className='outline-none p-2 border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg w-full focus:border-indigo-400 transition shadow-sm'
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Spinner />
                        </div>
                    ) : (
                        <FoundUsers users={users} />
                    )}
                </div>
            </div>
        </div>
    )
}
