import { profileStyles } from '@/app/(root)/(auth)/styles'
import PhoneEditView from '@/app/(root)/(user-profile)/_components/profile-phone/PhoneEditView'
import PhoneVerifyView from '@/app/(root)/(user-profile)/_components/profile-phone/PhoneVerifyView'
import ProfilePhoneInput from '@/app/(root)/(user-profile)/_components/profile-phone/ProfilePhoneInput'
import useTimer from '@/hooks/useTimer'
import { authClient } from '@/lib/auth-client'
import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'
import { CONFIG } from '../../../../../../config/config'
import AlertMessage from '../AlertMessage'

const ProfilePhoneSetting = ({ isEditing }: { isEditing: boolean }) => {
	const [isSaving, setIsSaving] = useState(false)
	const [newPhoneNumber, setNewPhoneNumber] = useState<string>('')
	const [isSendingOTP, setIsSendingOTP] = useState(false)
	const [code, setCode] = useState('')
	const [attemptsLeft, setAttemptsLeft] = useState(CONFIG.MAX_ATTEMPTS)
	const { timeLeft, canResend, startTimer } = useTimer(CONFIG.TIMEOUT_PERIOD)
	const [verificationStep, setVerificationStep] = useState<'edit' | 'verify'>(
		'edit',
	)
	const [error, setError] = useState('')
	const { user, fetchUserData } = useAuthStore()
	const isPhoneRegistered = user?.phoneNumberVerified === true
	const currentPhone = user?.phoneNumber || ''

	useEffect(() => {
		if (user) {
			setNewPhoneNumber(currentPhone)
		}
	}, [currentPhone, user])

	const handlePhoneChange = (value: string) => {
		setNewPhoneNumber(value)
		setError('')
	}

	const handleCancel = () => {
		setNewPhoneNumber(currentPhone)
		setVerificationStep('edit')
		setError('')
		setCode('')
		setAttemptsLeft(CONFIG.MAX_ATTEMPTS)
	}

	const updatePhoneDirectly = async () => {
		const response = await fetch('/api/auth/update-phone', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				phoneNumber: newPhoneNumber,
				userId: user?.id,
			}),
		})

		const data = await response.json()

		if (!response.ok) {
			setError(data.error)
			return
		}

		await fetchUserData()
		alert('Номер телефона успешно обновлен!')
	}

	const handleSave = async () => {
		if (!user) return

		if (newPhoneNumber === currentPhone) {
			setError('Новый номер телефона совпадает с текущим')
			return
		}

		setIsSaving(true)
		setError('')

		try {
			if (!isPhoneRegistered) {
				await updatePhoneDirectly()
			} else {
				await sendVerificationCode()
			}
		} catch (error) {
			console.error('Ошибка при сохранении:', error)

			if (error instanceof Error) {
				setError(error.message)
			} else {
				setError(
					'Произошла неизвестная ошибка при смене номера телефона',
				)
			}
		} finally {
			setIsSaving(false)
		}
	}

	const sendVerificationCode = async () => {
		setIsSendingOTP(true)
		setError('')

		try {
			await authClient.phoneNumber.sendOtp(
				{ phoneNumber: currentPhone },
				{
					onSuccess: () => {
						setIsSendingOTP(false)
						setVerificationStep('verify')
						startTimer()
					},
					onError: ctx => {
						setIsSendingOTP(false)
						setError(
							ctx.error?.message || 'Ошибка при отправке SMS',
						)
					},
				},
			)
			return true
		} catch (error) {
			setIsSendingOTP(false)
			setError(
				error instanceof Error ? error.message : 'Неизвестная ошибка',
			)
			return false
		}
	}

	const verifyCodeAndUpdatePhone = async () => {
		if (code.length !== 4) return

		setIsSaving(true)

		try {
			const { error: verifyError } = await authClient.phoneNumber.verify({
				phoneNumber: currentPhone,
				code,
			})

			if (verifyError) throw verifyError

			updatePhoneDirectly()
			setVerificationStep('edit')
			setCode('')
			setAttemptsLeft(CONFIG.MAX_ATTEMPTS)
		} catch (error) {
			handleVerificationError(error)
		} finally {
			setIsSaving(false)
		}
	}

	const handleVerificationError = (error: unknown) => {
		console.error('Ошибка верификации:', error)
		setCode('')
		setAttemptsLeft(prev => prev - 1)
		if (attemptsLeft <= 1) {
			setError('Попытки исчерпаны. Начните процесс заново')
			setTimeout(() => handleCancel(), 2000)
		} else {
			setError(`Неверный код. Осталось попыток: ${attemptsLeft - 1}`)
		}
	}

	const handleResendCode = async () => {
		if (!canResend) return
		await sendVerificationCode()
	}

	return (
		<div className='mb-8'>
			<div className='flex flex-wrap justify-between items-center mb-4 gap-4'>
				<h3 className={profileStyles.sectionTitle}>Телефон</h3>

				{!isEditing && (
					<div
						className='flex gap-2 w-full md:w-auto invisible'
						aria-hidden='true'
					>
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

				{isEditing && verificationStep === 'edit' && (
					<PhoneEditView
						onCancel={handleCancel}
						isSaving={isSaving}
						onSave={handleSave}
						isSendingOTP={isSendingOTP}
					/>
				)}
				{isEditing && verificationStep === 'verify' && (
					<PhoneEditView
						onCancel={handleCancel}
						isSaving={isSaving}
						isSendingOTP={isSendingOTP}
						isVerificationMode={true}
					/>
				)}
			</div>

			<ProfilePhoneInput
				value={newPhoneNumber}
				onChange={handlePhoneChange}
				disabled={!isEditing || verificationStep === 'verify'}
			/>

			{isEditing && !isPhoneRegistered && (
				<AlertMessage
					type='success'
					message='Вы можете изменить номер телефона без подтверждения, так как были зарегистрированы по email'
				/>
			)}

			{isEditing && isPhoneRegistered && (
				<AlertMessage
					type='warning'
					message='Для смены номера телефона потребуется подтверждение через код в SMS'
				/>
			)}

			{error && <AlertMessage type='error' message={error} />}

			{verificationStep === 'verify' && (
				<PhoneVerifyView
					currentPhone={currentPhone}
					code={code}
					isSaving={isSaving}
					onCodeChange={value => {
						setCode(value.replace(/\D/g, ''))
						setError('')
					}}
					onVerify={verifyCodeAndUpdatePhone}
					canResend={canResend}
					timeLeft={timeLeft}
					onResendCode={handleResendCode}
				/>
			)}
		</div>
	)
}

export default ProfilePhoneSetting
