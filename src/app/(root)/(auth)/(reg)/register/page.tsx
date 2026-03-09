'use client'

import CardInput from '@/app/(root)/(auth)/(reg)/CardInput'
import CheckboxCard from '@/app/(root)/(auth)/(reg)/CheckboxCard'
import DateInput from '@/app/(root)/(auth)/(reg)/DateInput'
import EmailInput from '@/app/(root)/(auth)/(reg)/EmailInput'
import GenderSelect from '@/app/(root)/(auth)/(reg)/GenderSelect'
import PasswordInput from '@/app/(root)/(auth)/(reg)/PasswordInput'
import PersonInput from '@/app/(root)/(auth)/(reg)/PersonInput'
import PhoneInput from '@/app/(root)/(auth)/(reg)/PhoneInput'
import RegFormFooter from '@/app/(root)/(auth)/(reg)/RegFormFooter'
import SelectCity from '@/app/(root)/(auth)/(reg)/SelectCity'
import SelectRegion from '@/app/(root)/(auth)/(reg)/SelectRegion'
import SuccessModal from '@/app/(root)/(auth)/(reg)/SuccessModal'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { Loader } from '@/components/features/common/loader'
import { validateRegisterForm } from '@/utils/validation/form'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const initialFormData = {
	phone: '+7',
	surname: '',
	firstName: '',
	password: '',
	confirmPassword: '',
	birthdayDate: '',
	region: '',
	location: '',
	gender: '',
	card: '',
	email: '',
	hasCard: false,
}

const RegisterPage = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<{
		error: Error
		userMessage: string
	} | null>(null)
	const [formData, setFormData] = useState(initialFormData)
	const [showPassword, setShowPassword] = useState(false)
	const [invalidFormMessage, setInvalidFormMessage] = useState('')
	const router = useRouter()
	const [isSuccess, setIsSuccess] = useState(false)

	const handleClose = () => {
		setFormData(initialFormData)
		router.back()
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { id, type } = e.target
		const value = type === 'checkbox' ? e.target.checked : e.target.value

		if (invalidFormMessage) {
			setInvalidFormMessage('')
		}

		if (id === 'hasCard' && value === true) {
			setFormData(prev => ({
				...prev,
				hasCard: true,
				card: '',
			}))

			return
		}
		setFormData(prev => ({ ...prev, [id]: value }))
	}

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)
		setInvalidFormMessage('')

		const validation = validateRegisterForm(formData)
		if (!validation.isValid) {
			setInvalidFormMessage(
				validation.errorMessage || 'Заполните поля корректно',
			)
			setIsLoading(false)
			return
		}

		try {
			const [day, month, year] = formData.birthdayDate.split('.')
			const formattedBirthdayDate = new Date(`${year}-${month}-${day}`)

			const userData = {
				...formData,
				phone: formData.phone.replace(/\D/g, ''),
				birthdayDate: formattedBirthdayDate,
			}

			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			})

			if (!res.ok) {
				const data = await res.json()
				throw new Error(data.error || 'Ошибка при регистрации')
			}
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

	const isFormValid = () => validateRegisterForm(formData).isValid

	if (isLoading) return <Loader />
	if (error)
		return (
			<ErrorComponent
				error={error.error}
				userMessage={error.userMessage}
			/>
		)

	if (isSuccess) return <SuccessModal />

	return (
		<div className='fixed inset-0 z-100 flex items-center bg-black/50 justify-center min-h-screen'>
			<div className='bg-card rounded w-full max-w-171.75 max-h-screen overflow-y-auto'>
				<div className='flex justify-end'>
					<button
						onClick={handleClose}
						aria-label='Закрыть'
						className='rounded duration-300 cursor-pointer mb-8 bg-gray-200'
					>
						<X size={24} className='text-gray-700' />
					</button>
				</div>
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
								value={formData.phone}
								onChangeAction={handleChange}
							/>
							<PersonInput
								id='surname'
								label='Фамилия'
								value={formData.surname}
								onChangeAction={handleChange}
								placeholder='Иванов'
							/>
							<PersonInput
								id='firstName'
								label='Имя'
								value={formData.firstName}
								onChangeAction={handleChange}
								placeholder='Иван'
							/>
							<PasswordInput
								id='password'
								label='Пароль'
								value={formData.password}
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
								value={formData.confirmPassword}
								onChangeAction={handleChange}
								showPassword={showPassword}
								togglePasswordVisibilityAction={() =>
									setShowPassword(!showPassword)
								}
								compareWith={formData.password}
								placeholder='********'
							/>
						</div>
						<div className='flex flex-col gap-y-4 items-start'>
							<DateInput
								value={formData.birthdayDate}
								onChangeAction={value =>
									setFormData(prev => ({
										...prev,
										birthdayDate: value,
									}))
								}
							/>
							<SelectRegion
								value={formData.region}
								onChangeAction={value =>
									setFormData(prev => ({
										...prev,
										region: value,
									}))
								}
							/>
							<SelectCity
								value={formData.location}
								onChangeAction={value =>
									setFormData(prev => ({
										...prev,
										location: value,
									}))
								}
							/>
							<GenderSelect
								value={formData.gender}
								onChangeAction={gender =>
									setFormData(prev => ({ ...prev, gender }))
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
								value={formData.card}
								onChangeAction={handleChange}
								disabled={formData.hasCard}
							/>
							<CheckboxCard
								checked={formData.hasCard}
								onChangeAction={handleChange}
							/>
						</div>
						<EmailInput
							value={formData.email}
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
			</div>
		</div>
	)
}

export default RegisterPage
