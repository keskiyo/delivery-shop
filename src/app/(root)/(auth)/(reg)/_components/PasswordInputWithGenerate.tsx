'use client'

import PasswordInput from '@/app/(root)/(auth)/_components/PasswordInput'
import { RefreshCw } from 'lucide-react'
import { ChangeEvent } from 'react'
import { generatePassword } from '../../../../../../utils/generatePassword'

interface PasswordInputWithGenerateProps {
	id: string
	label: string
	value: string
	onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void
	showPassword: boolean
	togglePasswordVisibilityAction: () => void
	showRequirements?: boolean
	placeholder?: string
	inputClass?: string
	onPasswordGenerate?: (password: string) => void
}

/**
 * Компонент поля ввода пароля с кнопкой автогенерации
 *
 * Используется только на странице регистрации.
 * Расширяет стандартный PasswordInput добавлением кнопки генерации пароля.
 *
 * При нажатии на кнопку генерации:
 * - Создается случайный пароль длиной 8 символов
 * - Пароль соответствует всем требованиям валидации
 * - Вызывается callback onPasswordGenerate для обновления обоих полей (пароль и подтверждение)
 */
const PasswordInputWithGenerate = ({
	id,
	label,
	value,
	onChangeAction,
	togglePasswordVisibilityAction,
	showPassword,
	showRequirements,
	placeholder = '',
	inputClass = '',
	onPasswordGenerate,
}: PasswordInputWithGenerateProps) => {
	const handleGenerate = () => {
		const newPassword = generatePassword(8)

		// Создаем синтетическое событие для обновления поля
		const syntheticEvent = {
			target: {
				id,
				value: newPassword,
				type: 'text',
			},
		} as ChangeEvent<HTMLInputElement>

		onChangeAction(syntheticEvent)

		// Вызываем callback для обновления поля подтверждения пароля
		if (onPasswordGenerate) {
			onPasswordGenerate(newPassword)
		}
	}

	return (
		<div className='relative'>
			<PasswordInput
				id={id}
				label={label}
				value={value}
				onChangeAction={onChangeAction}
				showPassword={showPassword}
				togglePasswordVisibilityAction={togglePasswordVisibilityAction}
				showRequirements={showRequirements}
				placeholder={placeholder}
				inputClass={inputClass}
			/>
			<button
				type='button'
				onClick={handleGenerate}
				className='absolute right-12 top-[2.15rem] transform -translate-y-1/2 text-muted-foreground hover:text-green-600 transition-colors'
				title='Сгенерировать пароль'
			>
				<RefreshCw className='w-5 h-5 animate-spin' />
			</button>
		</div>
	)
}

export default PasswordInputWithGenerate
