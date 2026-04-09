"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { userRegisterSchema } from '@/src/schema-zod'
import { toast } from 'react-toastify'
import { createUser } from '@/actions/createUserAction'

export default function NewUserForm({children}:{children: React.ReactNode}) {
   const router = useRouter()

   const handleCreateUser = async (formData:FormData) => {
      
      if(formData.get('password') !== formData.get('confirmPas')) {
         toast.error('The passwords are incorrect')
         return
      }
      const data = {
         name: formData.get('name'),
         email: formData.get('email'),
         password: formData.get('password'),
      }  

      // Validate in the client
      const result = userRegisterSchema.safeParse(data)
      if(!result.success) {
         result.error.issues.forEach(issue => (
            toast.error(issue.message)
         ))
         return
      }
      // Validate in the server and create the user
      const response = await createUser(result.data)
      if(response?.errors) {
         response.errors.forEach(issue => (
            toast.error(issue.message)
         ))
         return
      }

      toast.success('User Created Correctly, you can log in')
      router.push('/')
   }

   return (
      <div className='flex flex-col lg:grid lg:grid-cols-2 justify-center items-center my-6 mx-4 lg:my-10 lg:mx-10 px-4 lg:px-0'>
         <p className="font-black text-2xl sm:text-3xl lg:text-4xl text-center mt-2 hover:text-slate-700 transition-all mx-5 mb-8 lg:m-20 text-shadow-lg">
            Create an {""}
            <span className="text-indigo-800 hover:text-indigo-700">account</span> {""}
            to start to {""}
            <span className="text-indigo-800 hover:text-indigo-700">talk with your friends</span>
         </p>

         <div className='bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-5 sm:p-8 lg:p-10 w-full max-w-lg lg:max-w-none'>
            <p className="font-black text-3xl sm:text-4xl lg:text-5xl text-center text-indigo-700 text-shadow-lg">Create Your Account</p>
            <form
               action={handleCreateUser}
               className='flex flex-col items-center mt-6 sm:mt-10 gap-4 sm:gap-5 w-full'
            >
              {children}

            <div>
                <p className="text-base lg:text-lg text-center transition-all">
                    ¿Ya tienes una cuenta?
                    <Link href={'/'}><span className="text-indigo-800 hover:text-indigo-900 font-bold"> Inicia Sesión</span></Link>
                </p>
                <p className="text-base lg:text-lg text-center transition-all">
                    ¿Olvidaste tu contraseña?
                    <Link href={'/recover-password'}><span className="text-indigo-800 hover:text-indigo-900 transition-all font-bold"> Recupera tu cuenta</span></Link>
                </p>
            </div>
            </form>
         </div>
      </div>
   )
}
