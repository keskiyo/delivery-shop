'use client'

import { EnterCode } from '@/app/(root)/(auth)/(reg)/_components/EnterCode'
import { AuthFormLayout } from '@/app/(root)/(auth)/_components/AuthFormLayout'
import { useRegFormContext } from '@/app/contexts/RegFormContext'
import { authClient } from '@/lib/auth-client'
import { PhoneOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ErrorContent } from '../../_components/ErrorContent'
import { LoadingContent } from '../../_components/LoadingContent'

/**
 * Страница верификации телефона после регистрации
 * 
 * Функционал:
 * - Проверка существования номера телефона в базе
 * - Автоматическая отправка SMS с кодом при загрузке
 * - Ввод полученного кода для завершения регистрации
 * - Повторная отправка кода при необходимости
 * 
 * Логика работы:
 * 1. Получает данные регистрации из RegFormContext (phoneNumber)
 * 2. При монтировании проверяет существование номера через /api/auth/check-phone
 * 3. Если номер уже зарегистрирован - показывает ошибку
 * 4. Если номер свободен - отправляет SMS с OTP кодом
 * 5. При успехе показывает EnterCode (форму ввода кода)
 * 6. После ввода кода завершается регистрация
 * 
 * Проверки:
 * - Номер телефона не должен быть уже зарегистрирован
 * - SMS должен быть успешно отправлен
 * 
 * Состояния:
 * - isLoading: проверка номера и отправка SMS
 * - verificationSent: SMS отправлен, показывается форма ввода кода
 * - error: ошибка (номер занят или ошибка отправки SMS)
 * 
 * Обработка ошибок:
 * - "Этот номер телефона уже зарегистрирован" -> предложение войти
 * - Ошибка отправки SMS -> кнопка "Попробовать снова"
 * 
 * Особенности:
 * - Использует useRef для предотвращения повторной отправки
 * - Проверяет номер перед отправкой SMS (экономия SMS)
 * - Использует authClient.phoneNumber.sendOtp для отправки
 * 
 * @route /verify/verify-phone
 */
export default function VerifyPhonePage() {
	const { regFormData } = useRegFormContext()
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [verificationSent, setVerificationSent] = useState(false)
	const hasSentInitialRequest = useRef(false)
	const router = useRouter()
	const phoneNumber = regFormData.phoneNumber

	const checkPhoneNumberExists = async (
		phoneNumber: string,
	): Promise<boolean> => {
		try {
			const response = await fetch('/api/auth/check-phone', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ phoneNumber }),
			})

			if (!response.ok) throw new Error('Ошибка проверки номера')

			const data = await response.json()

			return data.exists
		} catch (error) {
			console.error('Ошибка при проверке номера:', error)
			return false
		}
	}

	const verifyAccount = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)

			const exists = await checkPhoneNumberExists(phoneNumber)

			if (exists)
				throw new Error(
					'Этот номер телефона уже зарегистрирован. Попробуйте войти',
				)

			await authClient.phoneNumber.sendOtp(
				{ phoneNumber },
				{
					onSuccess: () => {
						setVerificationSent(true)
						setIsLoading(false)
					},
					onError: ctx => {
						setIsLoading(false)
						setVerificationSent(false)
						setError(
							ctx.error?.message || 'Ошибка при отправке SMS',
						)
					},
				},
			)
		} catch (err) {
			setIsLoading(false)
			setVerificationSent(false)
			setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
		}
	}, [phoneNumber])

	useEffect(() => {
		if (!hasSentInitialRequest.current && phoneNumber) {
			hasSentInitialRequest.current = true
			verifyAccount()
		}
	}, [verifyAccount, phoneNumber])

	const handleToLogin = () => router.replace('/login')
	const handleRetry = () => {
		verifyAccount()
	}

	return (
		<AuthFormLayout>
			{isLoading ? (
				<LoadingContent title='Отправка SMS' />
			) : error ? (
				<ErrorContent
					error={error}
					icon={<PhoneOff className='h-8 w-8 text-red-600' />}
					primaryAction={{ label: 'Войти', onClick: handleToLogin }}
					secondaryAction={{
						label: 'Попробовать снова',
						onClick: handleRetry,
					}}
				/>
			) : verificationSent ? (
				<EnterCode phoneNumber={phoneNumber} />
			) : null}
		</AuthFormLayout>
	)
}
