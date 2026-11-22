import Link from 'next/link'
import React from 'react'

export default function RecoverPassword() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 justify-center items-center min-h-[calc(100vh-70px)] px-4 py-8 gap-8 dark:bg-gray-900">
      {/* Left text */}
      <p className="font-black text-3xl sm:text-4xl text-center hover:text-slate-700 dark:text-white dark:hover:text-slate-300 transition-all order-2 lg:order-1">
        Recover your{' '}
        <span className="text-indigo-700 dark:text-indigo-400">account</span>{' '}
        to get back to{' '}
        <span className="text-indigo-700 dark:text-indigo-400">chatting with your friends</span>
      </p>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 sm:p-10 w-full max-w-md order-1 lg:order-2">
        <p className="font-black text-3xl sm:text-4xl text-center text-indigo-700 dark:text-indigo-400 mb-2">
          Recover Account
        </p>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-8">
          Enter your email and we&apos;ll send you instructions to reset your password.
        </p>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-bold text-slate-700 dark:text-slate-200 text-sm">
              Email
            </label>
            <input
              id='email'
              type="email"
              className="outline-none border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all p-3 rounded-xl w-full focus:border-indigo-400 shadow-sm"
              placeholder='user@example.com'
            />
          </div>

          <input
            type="submit"
            className="w-full py-3 bg-indigo-700 hover:bg-indigo-600 rounded-xl font-black text-lg text-white transition-all cursor-pointer shadow-md"
            value='Send Instructions'
          />

          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm dark:text-slate-300">
              Already remember your password?{' '}
              <Link href='/'>
                <span className="text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 font-bold">Log in</span>
              </Link>
            </p>
            <p className="text-sm dark:text-slate-300">
              Don&apos;t have an account?{' '}
              <Link href='/sign-up'>
                <span className="text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 font-bold">Create one</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
