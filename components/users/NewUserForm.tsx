"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { userRegisterSchema } from '@/src/schema-zod'
import { toast } from 'react-toastify'
import { createUser } from '@/actions/createUserAction'

export default function NewUserForm({ children }: { children: React.ReactNode }) {
   const router = useRouter()

   const handleCreateUser = async (formData: FormData) => {
      if (formData.get('password') !== formData.get('confirmPas')) {
         toast.error('Passwords do not match')
         return
      }
      const data = {
         name: formData.get('name'),
         email: formData.get('email'),
         password: formData.get('password'),
      }

      // Validate in the client
      const result = userRegisterSchema.safeParse(data)
      if (!result.success) {
         result.error.issues.forEach(issue => toast.error(issue.message))
         return
      }

      // Validate in the server and create the user
      const response = await createUser(result.data)
      if (response?.errors) {
         response.errors.forEach(issue => toast.error(issue.message))
         return
      }

      toast.success('Account created successfully! You can now log in')
      router.push('/')
   }

   return (
      <div className="flex flex-col lg:grid lg:grid-cols-2 justify-center items-center min-h-[calc(100vh-70px)] px-4 py-8 gap-8 dark:bg-gray-900">
         <p className="font-black text-3xl sm:text-4xl text-center hover:text-slate-700 dark:text-white dark:hover:text-slate-300 transition-all order-2 lg:order-1">
            Create an{' '}
            <span className="text-indigo-700 dark:text-indigo-400">account</span>{' '}
            and start{' '}
            <span className="text-indigo-700 dark:text-indigo-400">talking with your friends</span>
         </p>

         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 sm:p-10 w-full max-w-md order-1 lg:order-2">
            <p className="font-black text-3xl sm:text-4xl text-center text-indigo-700 dark:text-indigo-400 mb-8">
               Create Account
            </p>
            <form
               action={handleCreateUser}
               className='flex flex-col gap-5'
            >
               {children}

               <div className="flex flex-col gap-2 mt-2 text-center">
                  <p className="text-sm dark:text-slate-300">
                     Already have an account?{' '}
                     <Link href='/'>
                        <span className="text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 font-bold">Log in</span>
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
