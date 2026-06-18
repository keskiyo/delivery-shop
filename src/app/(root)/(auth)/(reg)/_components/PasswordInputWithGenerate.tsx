'use client'

import PasswordInput from '@/app/(root)/(auth)/_components/PasswordInput'
import { RefreshCw } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
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
	const [spinKey, setSpinKey] = useState(0)
	const handleGenerate = () => {
		const newPassword = generatePassword(8)
		setSpinKey(prev => prev + 1)

		const syntheticEvent = {
			target: {
				id,
				value: newPassword,
				type: 'text',
			},
		} as ChangeEvent<HTMLInputElement>

		onChangeAction(syntheticEvent)

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
				className='absolute transition-colors transform -translate-y-1/2 right-12 top-11 text-muted-foreground hover:text-brand'
				title='Сгенерировать пароль'
			>
				<RefreshCw
					key={spinKey}
					className='w-5 h-5 animate-spin-once'
				/>
			</button>
		</div>
	)
}

export default PasswordInputWithGenerate
