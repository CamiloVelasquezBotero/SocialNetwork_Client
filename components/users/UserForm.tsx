'use client'
import { useState } from "react"

type UserFormProps = {
    condition: 'sign up' | 'log in'
}

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
                <div className='flex flex-col sm:flex-row gap-2 sm:gap-5 items-start sm:items-center w-full justify-center'>
                    <label htmlFor="name" className='font-black text-xl sm:text-2xl lg:text-4xl text-shadow-lg'>Name</label>
                    <input
                        id="name"
                        type="name"
                        name='name'
                        className='outline-none shadow-xl border border-slate-200 transition-all p-2 rounded-lg w-full sm:w-auto sm:flex-1 max-w-md'
                        placeholder='¿What is your name?'
                        onChange={e => handleChange(e)}
                        value={values.name}
                    />
                </div>
            )}
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-5 items-start sm:items-center w-full justify-center'>
                <label htmlFor="email" className='font-black text-xl sm:text-2xl lg:text-4xl text-shadow-lg'>Email</label>
                <input
                    id="email"
                    type="email"
                    name='email'
                    className='outline-none shadow-xl border border-slate-200 transition-all p-2 rounded-lg w-full sm:w-auto sm:flex-1 max-w-md'
                    placeholder='Write your E-mail'
                    onChange={e => handleChange(e)}
                    value={values.email}
                />
            </div>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-5 items-start sm:items-center w-full justify-center'>
                <label htmlFor="password" className='font-black text-xl sm:text-2xl lg:text-4xl text-shadow-lg'>Password</label>
                <input
                    id="password"
                    type="password"
                    name='password'
                    className='outline-none shadow-xl border border-slate-200 transition-all p-2 rounded-lg w-full sm:w-auto sm:flex-1 max-w-md'
                    placeholder='Write your password'
                    onChange={e => handleChange(e)}
                    value={values.password}
                />
            </div>
            {condition === 'sign up' && (
                <div className='flex flex-col sm:flex-row gap-2 sm:gap-5 items-start sm:items-center w-full justify-center'>
                    <label htmlFor="confirmPas" className='font-black text-xl sm:text-2xl lg:text-4xl text-shadow-lg'>Confirm</label>
                    <input
                        id="confirmPas"
                        type="password"
                        name='confirmPas'
                        className='outline-none shadow-xl border border-slate-200 transition-all p-2 rounded-lg w-full sm:w-auto sm:flex-1 max-w-md'
                        placeholder='Confirm your password'
                        onChange={e => handleChange(e)}
                        value={values.confirmPas}
                    />
                </div>
            )}

            <input
                type="submit"
                className='text-shadow-md w-fit p-2 mt-5 bg-indigo-700 hover:bg-indigo-600 hover:shadow-md rounded-lg font-black text-xl sm:text-2xl text-white transition-all cursor-pointer'
                value={valueSubmit}
            />
        </>
    )
}
