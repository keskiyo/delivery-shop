'use client'

import { LoadingContent } from '@/app/(root)/(auth)/(reg)/_components/LoadingContent'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DeleteAccountModal from './DeleteAccountModal'

/**
 * Компонент секции безопасности в профиле пользователя
 * 
 * Функционал:
 * - Выход из личного кабинета
 * - Переключение режима редактирования профиля
 * - Удаление аккаунта с подтверждением
 * 
 * Логика работы:
 * 1. Кнопка "Выйти" - вызывает logout и редирект на главную
 * 2. Кнопка "Редактировать профиль" - переключает режим редактирования
 * 3. Кнопка "Удалить аккаунт" - открывает модальное окно подтверждения
 * 4. При подтверждении удаления отправляется запрос на /api/auth/delete-account
 * 5. После успешного удаления выполняется logout и редирект на /goodbye
 * 
 * Обработка ошибок:
 * - Показывает сообщение об ошибке над кнопками
 * - Закрывает модальное окно при ошибке
 * - Логирует ошибки в консоль
 * 
 * @param isEditing - Флаг режима редактирования профиля
 * @param setIsEditing - Функция переключения режима редактирования
 */
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
						className='flex flex-1 items-center justify-center h-12 bg-promo text-white px-4 py-2 rounded font-medium hover:shadow-button-cancel active:shadow-button-cancel-active duration-300 cursor-pointer'
					>
						Выйти из личного кабинета
					</button>

					<button
						onClick={handleChangeProfile}
						className='flex flex-1 items-center justify-center h-12 bg-brand text-white px-4 py-2 rounded font-medium hover:shadow-button-default active:shadow-button-cancel-active duration-300 cursor-pointer'
					>
						{isEditing ? 'Готово' : 'Редактировать профиль'}
					</button>

					<button
						onClick={handleOpenDeleteModal}
						className='bg-danger-soft hover:bg-danger text-danger hover:text-white px-4 py-2 h-12 rounded font-medium duration-300 text-center cursor-pointer w-full active:shadow-button-cancel-active'
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
