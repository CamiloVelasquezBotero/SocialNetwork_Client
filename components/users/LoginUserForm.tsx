'use client'
import Link from "next/link";
import { loginUser } from "@/actions/loginUserAction";
import { userLoginSchema } from "@/src/schema-zod";
import { toast } from "react-toastify";
import { useStore } from "@/src/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginUserForm({ children }: { children: React.ReactNode }) {
   const setToken = useStore((state) => state.setToken)
   const router = useRouter()

   useEffect(() => {
      const existsToken = localStorage.getItem('token')
      if (existsToken) {
         setToken(existsToken)
         router.push('/dashboard')
      }
   }, [])

   const handleSubmit = async (formData: FormData) => {
      const data = {
         email: formData.get('email'),
         password: formData.get('password'),
      }
      
      // Validate in the client
      const result = userLoginSchema.safeParse(data)
      if (!result.success) {
         result.error.issues.forEach(issue => toast.error(issue.message))
         return
      }

      // validate in the server
      const response = await loginUser(result.data)
      if (response?.errors) {
         response.errors.forEach(issue => toast.error(issue.message))
         return
      }

      // get the user and log in
      if (response?.token) {
         localStorage.setItem('token', response.token)
         setToken(response.token)
         router.push('/dashboard')
      }
   }

   return (
      <div className="flex flex-col lg:grid lg:grid-cols-2 justify-center items-center min-h-[calc(100vh-70px)] px-4 py-8 gap-8 dark:bg-gray-900">
         <p className="font-black text-3xl sm:text-4xl text-center hover:text-slate-700 dark:text-white dark:hover:text-slate-300 transition-all text-shadow-lg order-2 lg:order-1">
            Log in or{' '}
            <span className="text-indigo-700 dark:text-indigo-400">create an account</span>{' '}
            to start{' '}
            <span className="text-indigo-700 dark:text-indigo-400">chatting with your friends</span>
         </p>

         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 sm:p-10 w-full max-w-md order-1 lg:order-2">
            <p className="font-black text-4xl sm:text-5xl text-center text-indigo-700 dark:text-indigo-400 mb-8">
               Log In
            </p>
            <form
               action={handleSubmit}
               className='flex flex-col gap-5'
            >
               {children}

               <div className="flex flex-col gap-2 mt-2 text-center">
                  <p className="text-sm dark:text-slate-300">
                     Don't have an account?{' '}
                     <Link href='/sign-up'>
                        <span className="text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 font-bold">Sign up here</span>
                     </Link>
                  </p>
                  <p className="text-sm dark:text-slate-300">
                     Forgot your password?{' '}
                     <Link href='/recover-password'>
                        <span className="text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 font-bold">Recover it</span>
                     </Link>
                  </p>
               </div>
            </form>
         </div>
      </div>
   )
}
