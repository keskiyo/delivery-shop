'use client'

import { LoadingContent } from '@/app/(root)/(auth)/(reg)/_components/LoadingContent'
import OTPResendCode from '@/app/(root)/(auth)/_components/OTPResendButton'
import { useRegFormContext } from '@/app/contexts/RegFormContext'
import useTimer from '@/hooks/useTimer'
import { authClient } from '@/lib/auth-client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CONFIG } from '../../../../../../config/config'
import { buttonStyles } from '../../styles'

/**
 * Компонент ввода OTP кода для верификации телефона при регистрации
 *
 * Функционал:
 * - Ввод 4-значного OTP кода
 * - Таймер обратного отсчета (180 секунд)
 * - Повторная отправка кода после истечения таймера
 * - Ограничение попыток ввода (3 попытки)
 * - Верификация телефона через better-auth
 * - Установка пароля после верификации
 * - Обновление данных пользователя
 *
 * Логика работы:
 * 1. Пользователь вводит 4-значный код из SMS
 * 2. При отправке вызывается authClient.phoneNumber.verify
 * 3. После успешной верификации устанавливается пароль через /api/auth/set-password
 * 4. Обновляются дополнительные данные пользователя (имя, дата рождения и т.д.)
 * 5. Редирект на страницу входа
 *
 * Ограничения:
 * - Максимум 3 попытки ввода кода
 * - Таймер 180 секунд (3 минуты)
 * - После 3 неудачных попыток блокировка до истечения таймера
 *
 * Особенности:
 * - Автоматический запуск таймера при монтировании
 * - Кнопка повторной отправки активна только после истечения таймера
 * - Показ оставшихся попыток при ошибке
 * - Индикатор загрузки во время верификации
 *
 * @param phoneNumber - Номер телефона для верификации (формат: +7XXXXXXXXXX)
 */
export const EnterCode = ({ phoneNumber }: { phoneNumber: string }) => {
	const [code, setCode] = useState('')
	const [error, setError] = useState('')
	const { regFormData } = useRegFormContext()
	const [attemptsLeft, setAttemptsLeft] = useState(CONFIG.MAX_ATTEMPTS)
	const { timeLeft, canResend, startTimer } = useTimer(CONFIG.TIMEOUT_PERIOD)
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		startTimer()
	}, [])

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		if (code.length !== 4) return

		setIsLoading(true)

		try {
			const { data: verifyData, error: verifyError } =
				await authClient.phoneNumber.verify({
					phoneNumber,
					code,
					disableSession: false,
					surname: regFormData.surname,
					birthdayDate: regFormData.birthdayDate,
					region: regFormData.region,
					location: regFormData.location,
					gender: regFormData.gender,
				})

			if (verifyError) throw verifyError

			setAttemptsLeft(CONFIG.MAX_ATTEMPTS)

			const passwordResponse = await fetch('/api/auth/set-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: verifyData.user.id,
					password: regFormData.password,
				}),
			})

			if (!passwordResponse.ok) {
				const errorData = await passwordResponse.json()
				console.error('Детали ошибки', errorData)
				throw new Error(errorData.error || 'Ошибка установки пароля')
			}

			let userDataToUpdate = { ...regFormData }

			if (verifyData.user.phoneNumberVerified) {
				const { email, phoneNumber, ...rest } = userDataToUpdate
				userDataToUpdate = rest as typeof regFormData
			}

			const { error: updateError } =
				await authClient.updateUser(userDataToUpdate)

			if (updateError) throw updateError

			router.replace('/login')
		} catch (error) {
			console.error('Ошибка верификации телефона:', error)
			setCode('')
			setAttemptsLeft(prev => prev - 1)

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

	if (isLoading) {
		return <LoadingContent title={'Проверяем код...'} />
	}

	return (
		<>
			<div className='flex flex-col gap-y-8'>
				<h1 className='text-2xl font-bold text-center'>Регистрация</h1>
				<div>
					<p className='text-center'>Код из SMS</p>
					<form
						onSubmit={handleSubmit}
						className='w-65 mx-auto max-h-screen flex flex-col justify-center items-center'
						autoComplete='off'
					>
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
							className='flex justify-center w-27.5 h-15 text-center text-2xl px-4 py-3 border border-[#bfbfbf] rounded focus:border-[#70c05b] focus:shadow-(--shadow-button-default) focus:outline-none'
							autoComplete='one-time-code'
							required
						/>
						{error && (
							<div className='text-red-500 text-center mt-2 text-sm'>
								{error}
							</div>
						)}
						<button
							type='submit'
							className={`${buttonStyles.base} ${code.length !== 4 ? buttonStyles.inactive : buttonStyles.active} [&&]:mt-8 mb-0`}
							disabled={code.length !== 4 || attemptsLeft <= 0}
						>
							Подтвердить
						</button>
					</form>
				</div>

				<OTPResendCode
					canResend={canResend}
					timeLeft={timeLeft}
					onResendAction={handleResend}
				/>

				<Link
					href='/register'
					className='h-8 text-xs text-gray-400 hover:text-gray-500 w-30 flex items-center justify-center gap-x-2 mx-auto duration-300 cursor-pointer'
				>
					<ArrowLeft size={24} />
					Вернуться
				</Link>
			</div>
		</>
	)
}
