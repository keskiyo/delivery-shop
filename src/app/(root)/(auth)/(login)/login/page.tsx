'use client'

import { AuthMethodSelector } from '@/app/(root)/(auth)/(login)/login/_components/AuthMethodSelector'
import { UnverifiedEmail } from '@/app/(root)/(auth)/(login)/login/_components/UnverifiedEmail'
import { ErrorContent } from '@/app/(root)/(auth)/(reg)/_components/ErrorContent'
import { LoadingContent } from '@/app/(root)/(auth)/(reg)/_components/LoadingContent'
import { AuthFormLayout } from '@/app/(root)/(auth)/_components/AuthFormLayout'
import { buttonStyles, formStyles } from '@/app/(root)/(auth)/styles'
import { InputMask } from '@react-input/mask'
import { MailWarning, PhoneOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const EnterLoginPage = () => {
	const [loginType, setLoginType] = useState<'email' | 'phone'>('email')
	const [login, setLogin] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [showUnverifiedEmail, setShowUnverifiedEmail] = useState(false)
	const [showAuthMethodChoice, setShowAuthMethodChoice] = useState(false)
	const router = useRouter()

	const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setLogin(value)
		setError(null)
	}

	const handleForgotPassword = () => {
		if (loginType === 'phone') {
			router.replace('/phone-pass-reset')
		} else {
			router.replace('/forgot-password')
		}
	}

	const switchToEmail = () => {
		setLogin('')
		setLoginType('email')
	}

	const switchToPhone = () => {
		setLogin('')
		setLoginType('phone')
	}

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch('/api/auth/check-login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ login, loginType }),
			})

			const { exists, verified } = await response.json()

			if (!exists) {
				setError(
					loginType === 'email'
						? 'E-mail не зарегистрирован'
						: 'Телефон не зарегистрирован',
				)
				return
			}

			if (!verified && loginType === 'email') {
				setShowUnverifiedEmail(true)
				return
			}

			if (!verified && loginType === 'phone') {
				setError('Телефон не верифицирован зайдите по e-mail')
				return
			}

			if (loginType === 'phone') {
				setShowAuthMethodChoice(true)
			} else {
				router.push(
					`/password-enter?login=${encodeURIComponent(login)}&loginType=${loginType}`,
				)
			}
		} catch {
			setError('Возникла ошибка при проверке логина')
		} finally {
			setIsLoading(false)
		}
	}

	const handleToRegister = () => router.replace('/register')

	const handleBackFromMethodChoice = () => {
		setShowAuthMethodChoice(false)
		setLogin('')
		setLoginType('phone')
	}

	const handleAuthMethodSelect = (method: 'password' | 'otp') => {
		const cleanLogin = login.replace(/\D/g, '')

		router.replace(
			method === 'password'
				? `/password-enter?login=${encodeURIComponent(cleanLogin)}&loginType=phone`
				: `/otp-enter?login=${encodeURIComponent(cleanLogin)}&loginType=phone`,
		)
	}

	if (isLoading) {
		return (
			<AuthFormLayout>
				<LoadingContent
					title={
						<span style={{ whiteSpace: 'pre-line' }}>
							{`Проверка ${loginType === 'email' ? 'email' : 'телефона'}\n${login}`}
						</span>
					}
				/>
			</AuthFormLayout>
		)
	}

	if (error)
		return (
			<AuthFormLayout>
				<ErrorContent
					title='Упс!'
					error={error}
					icon={
						loginType === 'email' ? (
							<MailWarning className='h-8 w-8 text-red-600' />
						) : (
							<PhoneOff className='h-8 w-8 text-red-600' />
						)
					}
					secondaryAction={{
						label: 'Регистрация',
						onClick: handleToRegister,
					}}
				/>
			</AuthFormLayout>
		)

	if (showUnverifiedEmail) {
		return (
			<UnverifiedEmail
				email={login}
				setLoginAction={setLogin}
				setShowUnverifiedEmailAction={setShowUnverifiedEmail}
			/>
		)
	}

	if (showAuthMethodChoice) {
		return (
			<AuthMethodSelector
				phoneNumber={login}
				onBackAction={handleBackFromMethodChoice}
				onMethodSelectAction={handleAuthMethodSelect}
			/>
		)
	}

	return (
		<AuthFormLayout>
			<h1 className='text-2xl font-bold text-center mb-8'>Вход</h1>

			<form
				onSubmit={handleSubmit}
				className='w-65 mx-auto max-h-screen flex flex-col justify-center overflow-y-auto gap-y-8'
				autoComplete='off'
			>
				<div className='flex bg-gray-100 rounded-xl p-1'>
					<button
						type='button'
						onClick={switchToEmail}
						className={`flex-1 py-2 rounded-lg text-sm transition cursor-pointer ${
							loginType === 'email'
								? 'bg-[#ff6633] text-white shadow'
								: 'text-gray-500'
						}`}
					>
						По email
					</button>

					<button
						type='button'
						onClick={switchToPhone}
						className={`flex-1 py-2 rounded-lg text-sm transition cursor-pointer ${
							loginType === 'phone'
								? 'bg-[#ff6633] text-white shadow'
								: 'text-gray-500'
						}`}
					>
						По телефону
					</button>
				</div>

				<div className='flex flex-col gap-2'>
					{loginType === 'phone' ? (
						<InputMask
							mask='+7 (___) ___-__-__'
							replacement={{ _: /\d/ }}
							value={login}
							placeholder='+7 (___) ___-__-__'
							onChange={handleLoginChange}
							className={formStyles.input}
							required
						/>
					) : (
						<input
							type='email'
							value={login}
							placeholder='example@mail.com'
							onChange={handleLoginChange}
							className={formStyles.input}
							required
						/>
					)}
				</div>

				<button
					type='submit'
					disabled={
						(loginType === 'email' &&
							(!login.includes('@') || !login.includes('.'))) ||
						(loginType === 'phone' &&
							login.replace(/\D/g, '').length < 11) ||
						isLoading
					}
					className={`
            ${buttonStyles.base} [&&]:my-0
           ${
				(loginType === 'email' &&
					(!login.includes('@') || !login.includes('.'))) ||
				(loginType === 'phone' &&
					login.replace(/\D/g, '').length < 11) ||
				isLoading
					? 'cursor-not-allowed bg-[#fcd5ba] text-[#ff6633]'
					: 'bg-[#ff6633] text-white hover:shadow-(--shadow-article)'
			}
            active:shadow-(--shadow-button-active)
           duration-300
            
          `}
				>
					Вход
				</button>

				<div className='flex flex-row flex-wrap mx-auto text-xs gap-4 justify-center'>
					<Link
						href='/register'
						className={`${formStyles.loginLink} w-auto px-2`}
					>
						Регистрация
					</Link>

					<button
						onClick={handleForgotPassword}
						className='h-8 text-gray-400 hover:text-gray-500 w-30 flex items-center justify-center duration-300'
					>
						Забыли пароль?
					</button>
				</div>
			</form>
		</AuthFormLayout>
	)
}

export default EnterLoginPage
