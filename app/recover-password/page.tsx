import Link from 'next/link'
import React from 'react'

export default function Login() {
  return (
    <div className='flex flex-col lg:grid lg:grid-cols-2 justify-center items-center mt-10 lg:mt-20 px-4 lg:px-0'>
      <p className="font-black text-2xl sm:text-3xl lg:text-4xl text-center mt-2 hover:text-slate-700 transition-all mx-5 mb-8 lg:m-20 text-shadow-lg">
        Recupera tu {""}
        <span className="text-indigo-800 hover:text-indigo-700">Cuenta</span> {""}
        para empezar a {""}
        <span className="text-indigo-800 hover:text-indigo-700">Chatear con tus friends</span>
      </p>

      <div className='bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-5 sm:p-8 lg:p-10 mx-2 lg:mr-10 w-full max-w-lg lg:max-w-none'>
        <p className="font-black text-3xl sm:text-4xl lg:text-5xl text-center text-indigo-700 text-shadow-lg">Recupera Tu Cuenta</p>
        <form
          action=""
          className='flex flex-col items-center mt-6 sm:mt-10 gap-4 sm:gap-5'
        >
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-5 items-start sm:items-center w-full justify-center'>
            <label htmlFor="email" className='font-black text-xl sm:text-2xl lg:text-4xl text-shadow-lg'>Email</label>
            <input
              id='email'
              type="email"
              className='outline-none shadow-xl border border-slate-200 transition-all p-2 rounded-lg w-full sm:w-auto sm:flex-1 max-w-md'
              placeholder='Write your E-mail'
            />
          </div>

          <input
            type="submit"
            className='w-fit p-2 mt-5 bg-indigo-500 hover:bg-indigo-600 hover:shadow-md rounded-lg font-black text-xl sm:text-2xl text-white transition-all cursor-pointer'
            value={'Confirmar'}
          />

          <div>
            <p className="text-base lg:text-lg text-center transition-all">
              ¿Ya tienes una cuenta?
              <Link href={'/'}><span className="text-indigo-800 hover:text-indigo-900 transition-all font-bold"> Inicia Sesión</span></Link>
            </p>
            <p className="text-base lg:text-lg text-center transition-all">
              ¿No tienes una cuenta?
              <Link href={'/sign-up'}><span className="text-indigo-800 hover:text-indigo-900 font-bold"> Crea una cuenta</span></Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
