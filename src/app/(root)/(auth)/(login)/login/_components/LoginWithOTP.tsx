'use client'

import { LoadingContent } from '@/app/(root)/(auth)/(reg)/_components/LoadingContent'
import { AuthFormLayout } from '@/app/(root)/(auth)/_components/AuthFormLayout'
import OTPResendCode from '@/app/(root)/(auth)/_components/OTPResendButton'
import { buttonStyles } from '@/app/(root)/(auth)/styles'
import useTimer from '@/hooks/useTimer'
import { authClient } from '@/lib/auth-client'
import { useAuthStore } from '@/store/authStore'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CONFIG } from '../../../../../../../config/config'

/**
 * Компонент входа по OTP коду из SMS
 * 
 * Функционал:
 * - Ввод 4-значного кода из SMS
 * - Верификация кода через better-auth
 * - Отслеживание попыток ввода (максимум 3)
 * - Таймер для повторной отправки кода (180 секунд)
 * - Автоматическая авторизация после успешной верификации
 * 
 * Логика работы:
 * 1. При монтировании запускает таймер обратного отсчета
 * 2. Пользователь вводит 4-значный код
 * 3. При отправке верифицирует код через authClient.phoneNumber.verify
 * 4. Если код верный - проверяет телефон в БД и авторизует пользователя
 * 5. Если код неверный - уменьшает счетчик попыток
 * 6. После 3 неудачных попыток перенаправляет на регистрацию
 * 7. Можно запросить повторную отправку кода (после истечения таймера)
 * 
 * Ограничения:
 * - Максимум 3 попытки ввода кода
 * - Таймер 180 секунд между отправками кода
 * - Код должен быть ровно 4 цифры
 * 
 * @param phoneNumber - Номер телефона для верификации
 */
const LoginWithOTP = ({ phoneNumber }: { phoneNumber: string }) => {
	const [code, setCode] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [attemptsLeft, setAttemptsLeft] = useState(CONFIG.MAX_ATTEMPTS)
	const { timeLeft, canResend, startTimer } = useTimer(CONFIG.TIMEOUT_PERIOD)
	const router = useRouter()
	const { login } = useAuthStore()

	// Запускаем таймер при монтировании компонента
	useEffect(() => {
		startTimer()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	/**
	 * Обработчик отправки формы с кодом
	 * 
	 * Процесс:
	 * 1. Верифицирует код через better-auth
	 * 2. Проверяет телефон в БД через /api/auth/check-phone
	 * 3. Авторизует пользователя через authStore.login()
	 * 4. Перенаправляет на главную страницу
	 * 
	 * При ошибке:
	 * - Очищает поле ввода
	 * - Уменьшает счетчик попыток
	 * - После 3 попыток перенаправляет на регистрацию
	 */
	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		if (code.length !== 4) return

		setIsLoading(true)

		try {
			// Верифицируем код через better-auth
			const { error: verifyError } = await authClient.phoneNumber.verify({
				phoneNumber,
				code,
				disableSession: false,
			})

			if (verifyError) throw verifyError

			// Сбрасываем счетчик попыток после успешной верификации
			setAttemptsLeft(CONFIG.MAX_ATTEMPTS)

			// Проверяем телефон в БД
			const response = await fetch('/api/auth/check-phone', {
				method: 'POST',
				body: JSON.stringify({
					phoneNumber,
				}),
			})

			if (!response.ok) {
				throw new Error('Данные не получены')
			}

			// Авторизуем пользователя
			login()

			// Перенаправляем на главную
			router.replace('/')
		} catch (error) {
			console.error('Ошибка верификации телефона:', error)
			setCode('')
			setAttemptsLeft(prev => prev - 1)

			// Проверяем количество оставшихся попыток
			if (attemptsLeft <= 1) {
				setError(
					'Попытки исчерпаны. Пожалуйста, зарегистрируйтесь снова',
				)
				setTimeout(() => router.replace('/register'), 2000)
			} else {
				setError(`Неверный код. Осталось попыток: ${attemptsLeft - 1}`)
			}
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Обработчик повторной отправки кода
	 * 
	 * Действия:
	 * - Отправляет новый OTP код на телефон
	 * - Перезапускает таймер
	 * - Сбрасывает ошибки и счетчик попыток
	 */
	const handleResend = async () => {
		if (!canResend) return
		try {
			await authClient.phoneNumber.sendOtp(
				{ phoneNumber },
				{
					onSuccess: () => {
						startTimer()
						setError('')
						setAttemptsLeft(CONFIG.MAX_ATTEMPTS)
					},
					onError: ctx => {
						setError(
							ctx.error?.message || 'Ошибка при отправке SMS',
						)
					},
				},
			)
		} catch (error) {
			console.error('Ошибка отправки кода:', error)
			setError('Ошибка при отправке кода')
		}
	}

	// Показываем индикатор загрузки во время верификации
	if (isLoading) {
		return (
			<AuthFormLayout>
				<LoadingContent title={'Проверяем код...'} />
			</AuthFormLayout>
		)
	}

	return (
		<AuthFormLayout>
			<div className='flex flex-col gap-y-8'>
				<h1 className='text-2xl font-bold text-center'>Вход</h1>
				<div>
					<p className='text-center'>Код из SMS</p>
					<form
						onSubmit={handleSubmit}
						className='w-65 mx-auto max-h-screen flex flex-col justify-center items-center'
						autoComplete='off'
					>
						{/* Поле ввода 4-значного кода */}
						<input
							type='text'
							inputMode='numeric'
							pattern='[0-9]{4}'
							maxLength={4}
							value={code}
							onChange={e => {
								setCode(e.target.value)
								setError('')
							}}
							className='flex justify-center w-27.5 h-15 text-center text-2xl px-4 py-3 border border-[#bfbfbf] rounded focus:border-[#70c05b] focus:shadow-(--shadow-button-default) text-gray-500 focus:bg-white focus:outline-none'
							autoComplete='one-time-code'
							required
						/>
						
						{/* Сообщение об ошибке */}
						{error && (
							<div className='text-red-500 text-center mt-2 text-sm'>
								{error}
							</div>
						)}
						
						{/* Кнопка подтверждения (активна только при 4 цифрах) */}
						<button
							type='submit'
							className={`${buttonStyles.base} ${code.length !== 4 ? buttonStyles.inactive : buttonStyles.active} [&&]:mt-8 mb-0`}
							disabled={code.length !== 4 || attemptsLeft <= 0}
						>
							Подтвердить
						</button>
					</form>
				</div>

				{/* Кнопка повторной отправки кода с таймером */}
				<OTPResendCode
					canResend={canResend}
					timeLeft={timeLeft}
					onResendAction={handleResend}
				/>

				{/* Ссылка возврата на страницу регистрации */}
				<Link
					href='/register'
					className='h-8 text-xs text-gray-400 hover:text-gray-500 w-30 flex items-center justify-center gap-x-2 mx-auto duration-300 cursor-pointer'
				>
					<ArrowLeft size={24} />
					Вернуться
				</Link>
			</div>
		</AuthFormLayout>
	)
}

export default LoginWithOTP
