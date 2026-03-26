'use client'

import CardInput from '@/app/(root)/(auth)/(reg)/_components/CardInput'
import CheckboxCard from '@/app/(root)/(auth)/(reg)/_components/CheckboxCard'
import DateInput from '@/app/(root)/(auth)/(reg)/_components/DateInput'
import EmailInput from '@/app/(root)/(auth)/(reg)/_components/EmailInput'
import GenderSelect from '@/app/(root)/(auth)/(reg)/_components/GenderSelect'
import PersonInput from '@/app/(root)/(auth)/(reg)/_components/PersonInput'
import RegFormFooter from '@/app/(root)/(auth)/(reg)/_components/RegFormFooter'
import SelectCity from '@/app/(root)/(auth)/(reg)/_components/SelectCity'
import SelectRegion from '@/app/(root)/(auth)/(reg)/_components/SelectRegion'
import VerificationMethodModal from '@/app/(root)/(auth)/(reg)/_components/VerificationMethodModal'
import { AuthFormLayout } from '@/app/(root)/(auth)/_components/AuthFormLayout'
import PasswordInput from '@/app/(root)/(auth)/_components/PasswordInput'
import PhoneInput from '@/app/(root)/(auth)/_components/PhoneInput'
import { useRegFormContext } from '@/app/contexts/RegFormContext'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { Loader } from '@/components/features/common/loader'
import { initialRegFormData } from '@/constants/RegFormData'
import { RegFormData } from '@/types/regFormData'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { validateRegisterForm } from '../../../../../../utils/validation/form'

const RegisterPage = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<{
		error: Error
		userMessage: string
	} | null>(null)
	const [registerForm, setRegisterForm] =
		useState<RegFormData>(initialRegFormData)
	const [showPassword, setShowPassword] = useState(false)
	const [invalidFormMessage, setInvalidFormMessage] = useState('')
	const [isSuccess, setIsSuccess] = useState(false)
	const { setRegFormData } = useRegFormContext()
	const router = useRouter()

	useEffect(() => {
		if (isSuccess && !registerForm.email) {
			router.push('/verify/verify-phone')
		}
	}, [isSuccess, registerForm.email, router])

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { id, type } = e.target
		const value = type === 'checkbox' ? e.target.checked : e.target.value

		if (invalidFormMessage) {
			setInvalidFormMessage('')
		}

		if (id === 'hasCard' && value === true) {
			setRegisterForm(prev => ({
				...prev,
				hasCard: true,
				card: '',
			}))

			return
		}
		setRegisterForm(prev => ({ ...prev, [id]: value }))
	}

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)
		setInvalidFormMessage('')

		const validation = validateRegisterForm(registerForm)
		if (!validation.isValid) {
			setInvalidFormMessage(
				validation.errorMessage || 'Заполните поля корректно',
			)
			setIsLoading(false)
			return
		}

		try {
			const [day, month, year] = registerForm.birthdayDate.split('.')
			const formattedBirthdayDate = new Date(`${year}-${month}-${day}`)

			const userData = {
				...registerForm,
				phoneNumber: registerForm.phoneNumber.replace(/\D/g, ''),
				birthdayDate: formattedBirthdayDate.toISOString(),
			}

			setRegFormData(userData)

			setIsSuccess(true)
		} catch (error) {
			setError({
				error:
					error instanceof Error
						? error
						: new Error('Неизвестная ошибка'),
				userMessage: 'Ошибка при регистрации',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const isFormValid = () => validateRegisterForm(registerForm).isValid

	if (isLoading) return <Loader />
	if (error)
		return (
			<ErrorComponent
				error={error.error}
				userMessage={error.userMessage}
			/>
		)

	if (isSuccess && registerForm.email) return <VerificationMethodModal />

	return (
		<AuthFormLayout variant='register'>
			<h1 className='text-2xl font-bold text-center mb-10'>
				Регистрация
			</h1>
			<h2 className='text-lg font-bold text-center mb-6'>
				Обязательные поля
			</h2>
			<form
				onSubmit={handleSubmit}
				autoComplete='off'
				className='w-full max-w-138 mx-auto max-h-100vh flex flex-col justify-center overflow-y-auto'
			>
				<div className='w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4'>
					<div className='flex flex-col gap-y-4 items-start'>
						<PhoneInput
							value={registerForm.phoneNumber}
							onChangeAction={handleChange}
						/>
						<PersonInput
							id='surname'
							label='Фамилия'
							value={registerForm.surname}
							onChangeAction={handleChange}
							placeholder='Иванов'
						/>
						<PersonInput
							id='name'
							label='Имя'
							value={registerForm.name}
							onChangeAction={handleChange}
							placeholder='Иван'
						/>
						<PasswordInput
							id='password'
							label='Пароль'
							value={registerForm.password}
							onChangeAction={handleChange}
							showPassword={showPassword}
							togglePasswordVisibilityAction={() =>
								setShowPassword(!showPassword)
							}
							showRequirements={true}
							placeholder='********'
						/>
						<PasswordInput
							id='confirmPassword'
							label='Подтвердите пароль'
							value={registerForm.confirmPassword}
							onChangeAction={handleChange}
							showPassword={showPassword}
							togglePasswordVisibilityAction={() =>
								setShowPassword(!showPassword)
							}
							compareWith={registerForm.password}
							placeholder='********'
						/>
					</div>
					<div className='flex flex-col gap-y-4 items-start'>
						<DateInput
							value={registerForm.birthdayDate}
							onChangeAction={value =>
								setRegisterForm(prev => ({
									...prev,
									birthdayDate: value,
								}))
							}
						/>
						<SelectRegion
							value={registerForm.region}
							onChangeAction={handleChange}
						/>
						<SelectCity
							value={registerForm.location}
							onChangeAction={handleChange}
						/>
						<GenderSelect
							value={registerForm.gender}
							onChangeAction={gender =>
								setRegisterForm(prev => ({
									...prev,
									gender,
								}))
							}
						/>
					</div>
				</div>
				<h2 className='text-lg font-bold text-center mb-6 mt-10'>
					Необязательные поля
				</h2>
				<div className='w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4'>
					<div className='flex flex-col w-65 gap-y-4'>
						<CardInput
							value={registerForm.card}
							onChangeAction={handleChange}
							disabled={!!registerForm.hasCard}
						/>
						<CheckboxCard
							checked={registerForm.hasCard}
							onChangeAction={handleChange}
						/>
					</div>
					<EmailInput
						value={registerForm.email}
						onChangeAction={handleChange}
					/>
				</div>
				{invalidFormMessage && (
					<div className='text-red-500 text-center my-4 p-4 bg-red-50 rounded'>
						{invalidFormMessage}
					</div>
				)}
				<RegFormFooter
					isFormValid={isFormValid()}
					isLoading={isLoading}
				/>
			</form>
		</AuthFormLayout>
	)
}

export default RegisterPage
