'use client'
import { useEffect, useState } from "react";
import FoundUsers from "./FoundUsers";
import api from "@/src/lib/axios";
import { UserData, UsersFoundInSearch } from "@/src/types";
import { usersFoundInSearch } from "@/src/schema-zod";
import Spinner from "../ui/Spinner";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function UserSearch() {
    const [isLoading, setIsLoading] = useState(false)
    const [query, setQuery] = useState<string>('')
    const [users, setUsers] = useState<UsersFoundInSearch>([])

    const router =  useRouter()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true) // Activamos spinner
                const {data} = await api.get(`/api/add-contact?query=${query}`)
                const result = usersFoundInSearch.safeParse(data)
                if(!result.success) {
                  return toast.error("Hubo un error en la busqueda")
                }
                // Mostramos los usuarios
                setUsers(result.data)
                setIsLoading(false) // Spinner off
            } catch (error) {
                console.log('There was an error fetching the users')
            }
        }
        if(query.length) {
          fetchUsers()
        } 
    }, [query])

  return (
    <div className='bg-white w-full max-w-3xl rounded-xl h-auto min-h-[400px] lg:h-135 shadow-md mx-auto lg:mx-0 px-3 sm:px-0'>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 lg:gap-10 mt-[3%] px-3 sm:px-0">
          <button 
            className="ml-0 sm:ml-[5%] shadow-2xl text-shadow-2xl p-2 transition-all bg-cyan-900 hover:bg-cyan-800 hover:scale-101 text-white font-bold text-base sm:text-xl rounded-xl cursor-pointer w-fit"
            onClick={() => router.push('/dashboard')}
          >
            Regresar
          </button>
          <p className="font-black text-2xl sm:text-3xl lg:text-4xl">
            Encuentra a tu <span className="text-indigo-800 text-shadow-2xl">Contacto</span>
          </p>
        </div>

        <form>
          <div className='flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-5 px-3 sm:px-0'>
            <label 
              htmlFor="querySearch" 
              className='font-bold text-lg sm:text-xl lg:text-2xl'
            >Email o Nombre:</label>
            <input
              id='querySearch'
              type="text"
              placeholder='Escribe el "Email" o "Nombre" de tu contacto'
              className='outline-none p-2 shadow-md w-full sm:w-auto sm:flex-1 max-w-md'
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </form>

          <div className="flex justify-center mt-5 w-auto px-2 sm:px-0">
            {isLoading ? (
              <Spinner />
            ): (
              <FoundUsers
                  users={users}
              />
            )}
          </div>
      </div>
  )
}
