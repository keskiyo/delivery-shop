'use client'

import { ErrorContent } from '@/app/(root)/(auth)/(reg)/_components/ErrorContent'
import { LoadingContent } from '@/app/(root)/(auth)/(reg)/_components/LoadingContent'
import { SuccessSent } from '@/app/(root)/(auth)/(reg)/_components/SuccessSent'
import { AuthFormLayout } from '@/app/(root)/(auth)/_components/AuthFormLayout'
import { useRegFormContext } from '@/app/contexts/RegFormContext'
import { authClient } from '@/lib/auth-client'
import { MailWarning } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Страница верификации email после регистрации
 * 
 * Функционал:
 * - Автоматическая отправка письма с подтверждением при загрузке
 * - Показ состояния отправки
 * - Повторная отправка письма при необходимости
 * - Обработка ошибок (дубликат email и др.)
 * 
 * Логика работы:
 * 1. Получает данные регистрации из RegFormContext
 * 2. При монтировании автоматически отправляет письмо через authClient.signUp.email
 * 3. Письмо содержит ссылку для подтверждения с callbackURL=/verify/verify-success
 * 4. При успехе показывает SuccessSent (инструкции проверить почту)
 * 5. При ошибке показывает ErrorContent с кнопками "Войти" и "Попробовать снова"
 * 
 * Обработка ошибок:
 * - "already exists" -> "Пользователь с таким email уже существует"
 * - Другие ошибки показываются как есть
 * 
 * Состояния:
 * - isLoading: отправка письма
 * - verificationSent: письмо отправлено успешно
 * - error: ошибка при отправке
 * 
 * Особенности:
 * - Использует useRef для предотвращения повторной отправки
 * - Проверяет наличие email в regFormData
 * - Кнопка "Попробовать снова" вызывает повторную отправку
 * 
 * @route /verify/verify-email
 */
export default function VerifyEmailPage() {
	const { regFormData } = useRegFormContext()
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [verificationSent, setVerificationSent] = useState(false)
	const hasSentInitialRequest = useRef(false)
	const router = useRouter()

	const verifyAccount = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)

			if (!regFormData.email) {
				throw new Error('Email обязателен для верификации')
			}

			await authClient.signUp.email(
				{
					...regFormData,
					email: regFormData.email,
					callbackURL: '/verify/verify-success',
				},
				{
					onSuccess: () => {
						setVerificationSent(true)
						setIsLoading(false)
					},
					onError: ctx => {
						setIsLoading(false)
						setVerificationSent(false)

						const errorMessage =
							ctx.error?.message || 'Неизвестная ошибка'

						if (errorMessage.includes('already exists')) {
							setError(
								'Пользователь с таким email уже существует',
							)
						} else {
							setError(errorMessage)
						}
					},
				},
			)
		} catch (err) {
			setIsLoading(false)
			setVerificationSent(false)
			setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
		}
	}, [regFormData])

	useEffect(() => {
		if (!hasSentInitialRequest.current && regFormData.email) {
			hasSentInitialRequest.current = true
			verifyAccount()
		}
	}, [verifyAccount, regFormData.email])

	const handleToLogin = () => router.replace('/login')
	const handleResend = () => {
		verifyAccount()
	}

	return (
		<AuthFormLayout>
			{isLoading ? (
				<LoadingContent title='Отправка письма' />
			) : error ? (
				<ErrorContent
					error={error}
					icon={<MailWarning className='h-8 w-8 text-red-600' />}
					primaryAction={{ label: 'Войти', onClick: handleToLogin }}
					secondaryAction={{
						label: 'Попробовать снова',
						onClick: handleResend,
					}}
				/>
			) : verificationSent ? (
				<SuccessSent />
			) : null}
		</AuthFormLayout>
	)
}
