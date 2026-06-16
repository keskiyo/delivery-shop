'use client'

import { LoadingContent } from '@/app/(root)/(auth)/(reg)/_components/LoadingContent'
import { showPromiseToast } from '@/lib/showToast'
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
			await showPromiseToast(logout(), {
				pending: 'Выходим из аккаунта...',
				success: 'Вы вышли из аккаунта',
				error: 'Не удалось выйти из приложения',
			})
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

			await showPromiseToast(
				(async () => {
					const response = await fetch('/api/auth/delete-account', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ userId: user.id }),
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(
							data.message || 'Не удалось удалить аккаунт',
						)
					}

					return data
				})(),
				{
					pending: 'Удаляем аккаунт...',
					success: 'Аккаунт удален',
					error: 'Не удалось удалить аккаунт',
				},
			)

			logout()
			router.replace('/goodbye')
		} catch (error) {
			console.error('Ошибка при удалении аккаунта:', error)
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Не удалось удалить аккаунт. Попробуйте позже.'
			setError(errorMessage)
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
			<div className='border-t border-border pt-8'>
				<h2 className='text-2xl font-bold mb-6'>Безопасность</h2>
				{error && (
					<div className='mb-4 p-3 bg-danger-soft border border-danger/30 text-danger rounded'>
						{error}
					</div>
				)}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<button
						onClick={logoutFromProfile}
						className='flex flex-1 items-center justify-center h-12 bg-promo text-white px-4 py-2 rounded font-medium hover:shadow-button-cancel active:shadow-button-cancel-active transition-custom cursor-pointer'
					>
						Выйти из личного кабинета
					</button>

					<button
						onClick={handleChangeProfile}
						className='flex flex-1 items-center justify-center h-12 bg-brand text-white px-4 py-2 rounded font-medium hover:shadow-button-default active:shadow-button-cancel-active transition-custom cursor-pointer'
					>
						{isEditing ? 'Готово' : 'Редактировать профиль'}
					</button>

					<button
						onClick={handleOpenDeleteModal}
						className='bg-danger-soft hover:bg-danger text-danger hover:text-white px-4 py-2 h-12 rounded font-medium transition-custom text-center cursor-pointer w-full active:shadow-button-cancel-active'
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
