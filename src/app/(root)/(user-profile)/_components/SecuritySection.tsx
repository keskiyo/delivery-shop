'use client'

import { LoadingContent } from '@/app/(root)/(auth)/(reg)/_components/LoadingContent'
import { buttonStyles } from '@/app/(root)/(auth)/styles'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DeleteAccountModal from './DeleteAccountModal'

const SecuritySection = ({
	isEditing,
	setIsEditing,
}: {
	isEditing: boolean
	setIsEditing: (value: boolean) => void
}) => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const { user, logout } = useAuthStore()
	const router = useRouter()

	const logoutFromProfile = async () => {
		try {
			await logout()
			router.replace('/')
		} catch (error) {
			console.error('Ошибка при выходе:', error)
			setError('Не удалось выйти из приложения')
		}
	}

	const handleChangeProfile = () => {
		setIsEditing(!isEditing)
	}

	const handleDeleteAccount = async () => {
		if (!user) return

		try {
			setIsLoading(true)
			setError(null)

			const response = await fetch('/api/auth/delete-account', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: user.id }),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || 'Не удалось удалить аккаунт')
			}

			logout() // Выходим из приложения, чтобы очистить Zustand store
			router.replace('/goodbye')
		} catch (error) {
			console.error('Ошибка при удалении аккаунта:', error)
			setError(
				error instanceof Error
					? error.message
					: 'Не удалось удалить аккаунт. Попробуйте позже.',
			)
		} finally {
			setIsLoading(false)
			setShowDeleteConfirm(false)
		}
	}

	const handleOpenDeleteModal = () => {
		setError(null)
		setShowDeleteConfirm(true)
	}

	const handleCloseDeleteModal = () => {
		setError(null)
		setShowDeleteConfirm(false)
	}

	if (isLoading) {
		return <LoadingContent title='Аккаунт удаляется ' />
	}

	return (
		<>
			<div className='border-t border-[#a3a3a3] pt-8'>
				<h2 className='text-2xl font-bold mb-6'>Безопасность</h2>
				{error && (
					<div className='mb-4 p-3 bg-red-100 border border-red-300 text-[#d80000] rounded'>
						{error}
					</div>
				)}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<button
						onClick={logoutFromProfile}
						className={`${buttonStyles.active} flex flex-1 items-center hover:bg-orange-500 justify-center h-12 bg-orange-600 text-[#606060] px-4 py-2 rounded font-medium hover:shadow-button-cancel active:shadow-button-cancel-active duration-300 cursor-pointer`}
					>
						Выйти из личного кабинета
					</button>

					<button
						onClick={handleChangeProfile}
						className={`${buttonStyles.active} flex flex-1 items-center hover:bg-green-500 justify-center h-12 bg-green-600 text-white px-4 py-2 rounded font-medium hover:shadow-button-default active:shadow-button-cancel-active duration-300 cursor-pointer`}
					>
						{isEditing ? 'Готово' : 'Редактировать профиль'}
					</button>

					<button
						onClick={handleOpenDeleteModal}
						className='bg-[#ffc7c7] hover:bg-[#d80000] text-[#d80000] hover:text-[#f2f2f2] px-4 py-2 h-12 rounded font-medium duration-300 text-center cursor-pointer w-full active:shadow-button-cancel-active'
					>
						Удалить аккаунт
					</button>
				</div>
			</div>
			<DeleteAccountModal
				isOpen={showDeleteConfirm}
				onClose={handleCloseDeleteModal}
				onConfirm={handleDeleteAccount}
				error={error}
			/>
		</>
	)
}

export default SecuritySection
