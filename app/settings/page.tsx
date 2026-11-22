'use client'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/src/store'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import api from '@/src/lib/axios'
import { ArrowLeftIcon, CameraIcon, KeyIcon } from '@heroicons/react/16/solid'

export default function SettingsPage() {
    const token = useStore((state) => state.token)
    const userData = useStore((state) => state.userData)
    const updateProfileImage = useStore((state) => state.updateProfileImage)
    const router = useRouter()

    // Password change form state
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    })
    const [isLoadingPassword, setIsLoadingPassword] = useState(false)

    // Image upload state
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [isLoadingImage, setIsLoadingImage] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!userData.email) {
            router.push('/')
        }
    }, [userData, router])

    // Image preview on file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Only images are allowed (jpg, png, etc.)')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image cannot exceed 5MB')
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            setPreviewImage(event.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    // Upload image to server
    const handleUploadImage = async () => {
        const file = fileInputRef.current?.files?.[0]
        if (!file) {
            toast.error('Please select an image first')
            return
        }

        setIsLoadingImage(true)
        try {
            const formData = new FormData()
            formData.append('image', file)

            const response = await api.post<{ profileImage: string }>('/api/upload-image', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })

            updateProfileImage(response.data.profileImage)
            toast.success('Profile picture updated successfully!')
            setPreviewImage(null)
        } catch (error) {
            const err = error as { response?: { data?: { error?: string } } }
            const message = err?.response?.data?.error || 'Error uploading image'
            toast.error(message)
        } finally {
            setIsLoadingImage(false)
        }
    }

    // Change password handler
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmNewPassword) {
            toast.error('Please fill in all fields')
            return
        }

        if (passwords.newPassword !== passwords.confirmNewPassword) {
            toast.error('New passwords do not match')
            return
        }

        if (passwords.newPassword.length < 5) {
            toast.error('New password must be at least 5 characters')
            return
        }

        setIsLoadingPassword(true)
        try {
            const response = await api.patch<{ message: string }>('/api/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            toast.success(response.data.message || 'Password updated successfully')
            setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
        } catch (error) {
            const err = error as { response?: { data?: { error?: string } } }
            const message = err?.response?.data?.error || 'Error changing password'
            toast.error(message)
        } finally {
            setIsLoadingPassword(false)
        }
    }

    const currentProfileImage = userData.profileImage || '/profile.jpg'

    return (
        <div className="flex justify-center w-full min-h-screen p-4 sm:p-8 dark:bg-gray-900">
            <div className="w-full max-w-2xl">

                {/* Back button */}
                <button
                    className="mb-6 flex items-center gap-2 p-2 px-4 bg-cyan-900 hover:bg-cyan-800 text-white font-bold rounded-xl transition cursor-pointer shadow-md text-sm"
                    onClick={() => router.push('/dashboard')}
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back
                </button>

                <h1 className="font-black text-3xl sm:text-4xl text-center mb-8 text-shadow-lg dark:text-white">
                    Profile <span className="text-indigo-700">Settings</span>
                </h1>

                {/* ===== PROFILE PICTURE SECTION ===== */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
                    <h2 className="flex items-center gap-2 font-black text-xl sm:text-2xl mb-6 dark:text-white">
                        <CameraIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        Profile Picture
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <img
                            src={previewImage || currentProfileImage}
                            alt="Profile photo"
                            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 shadow-lg"
                        />

                        <div className="flex flex-col gap-3 w-full">
                            <p className="text-slate-600 dark:text-slate-300 text-sm">
                                Upload a profile picture (JPG, PNG, max 5MB)
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer"
                                onChange={handleImageChange}
                            />

                            {previewImage && (
                                <button
                                    className="w-fit px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg transition cursor-pointer disabled:opacity-50"
                                    onClick={handleUploadImage}
                                    disabled={isLoadingImage}
                                >
                                    {isLoadingImage ? 'Uploading...' : 'Save Photo'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== CHANGE PASSWORD SECTION ===== */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
                    <h2 className="flex items-center gap-2 font-black text-xl sm:text-2xl mb-6 dark:text-white">
                        <KeyIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        Change Password
                    </h2>

                    <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-700 dark:text-slate-200">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                className="p-3 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 transition shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-700 dark:text-slate-200">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                className="p-3 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 transition shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Minimum 5 characters"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-700 dark:text-slate-200">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={passwords.confirmNewPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                                className="p-3 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 transition shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Repeat new password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoadingPassword}
                            className="mt-2 py-3 bg-indigo-700 hover:bg-indigo-600 text-white font-black text-lg rounded-xl transition cursor-pointer shadow-md disabled:opacity-50"
                        >
                            {isLoadingPassword ? 'Updating...' : 'Change Password'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}
