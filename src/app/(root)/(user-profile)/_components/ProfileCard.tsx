import { formStyles, profileStyles } from '@/app/(root)/(auth)/styles'
import { showPromiseToast } from '@/lib/showToast'
import { useAuthStore } from '@/store/authStore'
import { InputMask } from '@react-input/mask'
import { CreditCard } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
	cleanCardNumber,
	formatCardNumber,
	isValidCardNumber,
} from '../../../../../utils/validation/validProfileCard'


const ProfileCard = ({ isEditing }: { isEditing: boolean }) => {
	const { user, fetchUserData } = useAuthStore()
	const [cardNumber, setCardNumber] = useState(user?.card || '')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')


	useEffect(() => {
		if (user) {
			setCardNumber(user.card || '')
		}
	}, [user])


	const handleCancel = () => {
		setCardNumber(user?.card || '')
		setError('')
	}


	const handleSave = async () => {
		const cleanedCardNumber = cleanCardNumber(cardNumber)


		if (!cleanedCardNumber.trim()) {
			setError('Номер карты не может быть пустым')
			return
		}


		if (!isValidCardNumber(cleanedCardNumber)) {
			setError('Номер карты должен содержать 16 цифр')
			return
		}

		setIsLoading(true)
		setError('')

		try {
			await showPromiseToast(
				(async () => {
					const response = await fetch('/api/users/update-card', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							userId: user?.id,
							cardNumber: cleanedCardNumber,
						}),
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(
							data.error || 'Ошибка при обновлении карты',
						)
					}

					return data
				})(),
				{
					pending: 'Обновляем карту...',
					success: 'Карта успешно обновлена',
					error: 'Ошибка при обновлении карты',
				},
			)

			fetchUserData()
		} catch (error) {
			console.error(error)
			setError(
				error instanceof Error
					? error.message
					: 'Ошибка сети. Попробуйте еще раз.',
			)
		} finally {
			setIsLoading(false)
		}
	}


	const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isEditing) return

		const value = e.target.value
		const cleanValue = cleanCardNumber(value).slice(0, 16)
		setCardNumber(cleanValue)
	}


	const displayValue = formatCardNumber(cardNumber, isEditing)

	return (
		<div className='mb-8'>
			<div className='flex flex-wrap justify-between items-center mb-4 gap-4'>
				<h3 className={profileStyles.sectionTitle}>Карта</h3>

								{!isEditing && (
					<div className='flex gap-2 invisible' aria-hidden='true'>
						<button
							className={profileStyles.cancelButton}
							tabIndex={-1}
						>
							Отмена
						</button>
						<button
							className={profileStyles.saveButton}
							tabIndex={-1}
						>
							Сохранить
						</button>
					</div>
				)}

								{isEditing && (
					<div className='flex gap-2'>
						<button
							onClick={handleCancel}
							className={profileStyles.cancelButton}
							disabled={isLoading}
						>
							Отмена
						</button>
						<button
							onClick={handleSave}
							className={profileStyles.saveButton}
							disabled={isLoading}
						>
							{isLoading ? 'Сохранение...' : 'Сохранить'}
						</button>
					</div>
				)}
			</div>

			<div className={profileStyles.inputContainer}>
								{isEditing ? (
					<InputMask
						mask='____ ____ ____ ____'
						replacement={{ _: /\d/ }}
						value={displayValue}
						onChange={handleCardNumberChange}
						placeholder='0000 0000 0000 0000'
						className={`${formStyles.input} [&&]:w-full`}
						disabled={isLoading}
					/>
				) : (

					<input
						type='text'
						value={displayValue || 'Не указана'}
						className={`${formStyles.input} [&&]:w-full disabled:cursor-not-allowed [&&]:disabled:bg-surface`}
						disabled
						readOnly
					/>
				)}
								<CreditCard className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
			</div>

						{error && <p className='text-danger text-sm mt-2'>{error}</p>}

						{!user?.card && !isEditing && (
				<p className='text-muted-foreground text-sm mt-2'>
					Добавьте номер карты лояльности для получения бонусов
				</p>
			)}
		</div>
	)
}

export default ProfileCard
