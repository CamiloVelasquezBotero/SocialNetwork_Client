'use client'
import { useState } from "react"

type UserFormProps = {
    condition: 'sign up' | 'log in'
}

const inputClass = 'outline-none border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all p-3 rounded-xl w-full focus:border-indigo-400 shadow-sm'
const labelClass = 'font-bold text-slate-700 dark:text-slate-200 text-sm'

export default function UserForm({ condition }: UserFormProps) {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPas: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    const conditionText: Record<UserFormProps['condition'], string> = {
        'sign up': 'Create Account',
        'log in': 'Log In',
    }
    const valueSubmit = conditionText[condition]

    return (
        <>
            {condition === 'sign up' && (
                <div className="flex flex-col gap-1">
                    <label htmlFor="name" className={labelClass}>Name</label>
                    <input
                        id="name"
                        type="text"
                        name='name'
                        className={inputClass}
                        placeholder='What is your name?'
                        onChange={handleChange}
                        value={values.name}
                    />
                </div>
            )}

            <div className="flex flex-col gap-1">
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                    id="email"
                    type="email"
                    name='email'
                    className={inputClass}
                    placeholder='user@example.com'
                    onChange={handleChange}
                    value={values.email}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="password" className={labelClass}>Password</label>
                <input
                    id="password"
                    type="password"
                    name='password'
                    className={inputClass}
                    placeholder='Minimum 5 characters'
                    onChange={handleChange}
                    value={values.password}
                />
            </div>

            {condition === 'sign up' && (
                <div className="flex flex-col gap-1">
                    <label htmlFor="confirmPas" className={labelClass}>Confirm Password</label>
                    <input
                        id="confirmPas"
                        type="password"
                        name='confirmPas'
                        className={inputClass}
                        placeholder='Repeat your password'
                        onChange={handleChange}
                        value={values.confirmPas}
                    />
                </div>
            )}

            <input
                type="submit"
                className='w-full py-3 mt-2 bg-indigo-700 hover:bg-indigo-600 rounded-xl font-black text-lg text-white transition-all cursor-pointer shadow-md'
                value={valueSubmit}
            />
        </>
    )
}
