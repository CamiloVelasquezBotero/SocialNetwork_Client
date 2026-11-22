'use client'
import { useEffect } from 'react'
import { useStore } from '@/src/store'

// Applies dark theme when the app loads if saved in localStorage.
export default function DarkModeInit() {
    const darkMode = useStore((state) => state.darkMode)

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode')
        if (savedDarkMode === 'true') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    return null
}
