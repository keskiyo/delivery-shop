'use client'

import { ErrorContent } from '@/app/(root)/(auth)/(reg)/_components/ErrorContent'
import { LoadingContent } from '@/app/(root)/(auth)/(reg)/_components/LoadingContent'
import { AuthFormLayout } from '@/app/(root)/(auth)/_components/AuthFormLayout'
import { authClient } from '@/lib/auth-client'
import { PhoneOff } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import LoginWithOTP from '../login/_components/LoginWithOTP'

/**
 * Страница входа по OTP (одноразовый код) через SMS
 * 
 * Функционал:
 * - Автоматическая отправка SMS с кодом при загрузке страницы
 * - Ввод полученного кода для входа
 * - Повторная отправка кода при ошибке
 * 
 * Логика работы:
 * 1. Получает номер телефона из query параметра 'login'
 * 2. При монтировании автоматически отправляет SMS с OTP кодом
 * 3. Показывает состояние загрузки во время отправки
 * 4. При успехе показывает форму ввода кода (LoginWithOTP)
 * 5. При ошибке показывает сообщение с кнопкой "Попробовать снова"
 * 
 * Состояния:
 * - sending: отправка SMS
 * - sent: SMS отправлен, показывается форма ввода кода
 * - error: ошибка отправки, показывается сообщение об ошибке
 * 
 * Особенности:
 * - Использует useRef для предотвращения повторной отправки
 * - Обернут в Suspense для SSR
 * - Использует authClient.phoneNumber.sendOtp для отправки
 * 
 * @route /otp-enter?login=79991234567
 */
const EnterCodePage = () => {
	return (
		<Suspense
			fallback={
				<AuthFormLayout>
					<LoadingContent title={'Сейчас запросим код'} />
				</AuthFormLayout>
			}
		>
			<OTPLoginPage />
		</Suspense>
	)
}

const OTPLoginPage = () => {
	const searchParams = useSearchParams()
	const phoneNumber = searchParams.get('login') || ''
	const [status, setStatus] = useState<'sending' | 'sent' | 'error'>(
		'sending',
	)
	const [error, setError] = useState('')
	const isSentRef = useRef(false)

	useEffect(() => {
		const sendOTP = async () => {
			if (isSentRef.current || !phoneNumber) return

			isSentRef.current = true

			try {
				await authClient.phoneNumber.sendOtp(
					{ phoneNumber },
					{
						onSuccess: () => {
							setStatus('sent')
						},
						onError: ctx => {
							setStatus('error')
							setError(
								ctx.error?.message || 'Ошибка при отправке SMS',
							)
						},
					},
				)
			} catch (error) {
				setStatus('error')
				setError(
					error instanceof Error
						? error.message
						: 'Неизвестная ошибка',
				)
				isSentRef.current = false
			}
		}

		sendOTP()
	}, [phoneNumber])

	const handleRetry = () => {
		setStatus('sending')
		setError('')
		isSentRef.current = false
	}

	if (status === 'sending') {
		return (
			<AuthFormLayout>
				<LoadingContent
					title={`Отправка SMS на номер +${phoneNumber}`}
				/>
			</AuthFormLayout>
		)
	}

	if (status === 'error') {
		return (
			<AuthFormLayout>
				<ErrorContent
					error={error}
					icon={<PhoneOff className='h-8 w-8 text-red-600' />}
					primaryAction={{
						label: 'Попробовать снова',
						onClick: handleRetry,
					}}
				/>
			</AuthFormLayout>
		)
	}

	return <LoginWithOTP phoneNumber={phoneNumber} />
}

export default EnterCodePage
