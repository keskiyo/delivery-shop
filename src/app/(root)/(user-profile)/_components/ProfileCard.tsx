import { formStyles, profileStyles } from '@/app/(root)/(auth)/styles'
import { useAuthStore } from '@/store/authStore'
import { InputMask } from '@react-input/mask'
import { CreditCard } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
	cleanCardNumber,
	formatCardNumber,
	isValidCardNumber,
} from '../../../../../utils/validation/validProfileCard'

/**
 * Компонент управления картой лояльности в профиле пользователя
 * 
 * Функционал:
 * - Отображение номера карты лояльности (скрыт звездочками в режиме просмотра)
 * - Редактирование номера карты с валидацией
 * - Сохранение изменений на сервере
 * - Форматирование номера карты (группы по 4 цифры)
 * 
 * Логика работы:
 * 1. В режиме просмотра показывает карту как **** **** **** 1234
 * 2. В режиме редактирования показывает полный номер с маской ввода
 * 3. При сохранении валидирует номер (должен быть 16 цифр)
 * 4. Отправляет запрос на /api/users/update-card
 * 5. После успешного сохранения обновляет данные пользователя
 * 
 * Валидация:
 * - Номер карты не может быть пустым
 * - Номер карты должен содержать ровно 16 цифр
 * - Принимаются только цифры (остальные символы игнорируются)
 * 
 * Особенности:
 * - Использует InputMask для форматированного ввода
 * - Автоматически очищает номер от пробелов и дефисов
 * - Показывает подсказку если карта не добавлена
 * - Кнопки "Отмена" и "Сохранить" видны только в режиме редактирования
 * 
 * @param isEditing - Флаг режима редактирования (управляется родительским компонентом)
 */
const ProfileCard = ({ isEditing }: { isEditing: boolean }) => {
	const { user, fetchUserData } = useAuthStore()
	const [cardNumber, setCardNumber] = useState(user?.card || '')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	// Синхронизируем локальное состояние с данными пользователя
	useEffect(() => {
		if (user) {
			setCardNumber(user.card || '')
		}
	}, [user])

	/**
	 * Обработчик отмены редактирования
	 * Возвращает номер карты к исходному значению
	 */
	const handleCancel = () => {
		setCardNumber(user?.card || '')
		setError('')
	}

	/**
	 * Обработчик сохранения номера карты
	 * 
	 * Процесс:
	 * 1. Очищает номер от пробелов и дефисов
	 * 2. Валидирует номер (не пустой и 16 цифр)
	 * 3. Отправляет запрос на сервер
	 * 4. При успехе обновляет данные пользователя
	 * 5. При ошибке показывает сообщение
	 */
	const handleSave = async () => {
		const cleanedCardNumber = cleanCardNumber(cardNumber)

		// Валидация: номер не может быть пустым
		if (!cleanedCardNumber.trim()) {
			setError('Номер карты не может быть пустым')
			return
		}

		// Валидация: номер должен содержать 16 цифр
		if (!isValidCardNumber(cleanedCardNumber)) {
			setError('Номер карты должен содержать 16 цифр')
			return
		}

		setIsLoading(true)
		setError('')

		try {
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

			if (response.ok) {
				// Обновляем данные пользователя после успешного сохранения
				fetchUserData()
			} else {
				setError(data.error || 'Ошибка при обновлении карты')
			}
		} catch (error) {
			console.error(error)
			setError('Ошибка сети. Попробуйте еще раз.')
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Обработчик изменения номера карты
	 * Очищает ввод от нецифровых символов и ограничивает до 16 цифр
	 */
	const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isEditing) return

		const value = e.target.value
		const cleanValue = cleanCardNumber(value).slice(0, 16)
		setCardNumber(cleanValue)
	}

	// Форматируем номер для отображения (с пробелами или звездочками)
	const displayValue = formatCardNumber(cardNumber, isEditing)

	return (
		<div className='mb-8'>
			<div className='flex flex-wrap justify-between items-center mb-4 gap-4'>
				<h3 className={profileStyles.sectionTitle}>Карта</h3>

				{/* Невидимые кнопки для сохранения layout в режиме просмотра */}
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

				{/* Кнопки управления в режиме редактирования */}
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
				{/* Режим редактирования: поле с маской ввода */}
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
					/* Режим просмотра: disabled поле */
					<input
						type='text'
						value={displayValue || 'Не указана'}
						className={`${formStyles.input} [&&]:w-full disabled:cursor-not-allowed [&&]:disabled:bg-[#f3f2f1]`}
						disabled
						readOnly
					/>
				)}
				{/* Иконка карты */}
				<CreditCard className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
			</div>

			{/* Сообщение об ошибке */}
			{error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

			{/* Подсказка если карта не добавлена */}
			{!user?.card && !isEditing && (
				<p className='text-[#8f8f8f] text-sm mt-2'>
					Добавьте номер карты лояльности для получения бонусов
				</p>
			)}
		</div>
	)
}

export default ProfileCard
