'use client'

import Tooltip from '@/app/(root)/(auth)/_components/Tooltip'
import IconVision from '@/components/svg/IconVision'
import { isPasswordValid } from '@/utils/validation/passwordValid'
import { ChangeEvent, useState } from 'react'
import { formStyles } from '../styles'

interface PasswordInputProps {
	id: string
	label: string
	value: string
	onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void
	showPassword: boolean
	togglePasswordVisibilityAction: () => void
	showRequirements?: boolean
	compareWith?: string
	placeholder?: string
	inputClass?: string
}

const PasswordInput = ({
	id,
	label,
	value,
	onChangeAction,
	togglePasswordVisibilityAction,
	showPassword,
	showRequirements,
	compareWith,
	placeholder = '',
	inputClass = '',
}: PasswordInputProps) => {
	const [isFocused, setIsFocused] = useState(false)

	const shouldShowTooltip = () => {
		if (!isFocused) return false

		if (showRequirements) {
			return value.length > 0 && !isPasswordValid(value)
		}

		if (compareWith) {
			return (
				value.length > 0 &&
				compareWith.length > 0 &&
				value !== compareWith
			)
		}
		return false
	}

	const getTooltipText = () => {
		if (showRequirements) {
			return 'Пароль должен содержать: 6+ символов на латинице, цифры и заглавные буквы'
		}

		return 'Пароли пока не совпадают'
	}

	return (
		<div className='relative'>
			<label htmlFor={id} className={formStyles.label}>
				{label}
			</label>
			<div className='relative'>
				<input
					id={id}
					type={showPassword ? 'text' : 'password'}
					value={value}
					onChange={onChangeAction}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder={placeholder}
					className={`${formStyles.input} ${inputClass}`}
					// autoComplete='off'
				/>
				<button
					type='button'
					onClick={togglePasswordVisibilityAction}
					className='absolute right-3 top-1/2 transform -translate-y-1/2'
				>
					<IconVision showPassword={showPassword} />
				</button>
			</div>
			{shouldShowTooltip() && <Tooltip text={getTooltipText()} />}
		</div>
	)
}

export default PasswordInput
