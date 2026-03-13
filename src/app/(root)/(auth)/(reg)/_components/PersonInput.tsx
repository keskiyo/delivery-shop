import { ChangeEvent } from 'react'
import { formStyles } from '../../styles'

interface PersonInputProps {
	id: string
	label: string
	value: string
	onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void
	placeholder?: string
}

const PersonInput = ({
	id,
	label,
	value,
	onChangeAction,
	placeholder = '',
}: PersonInputProps) => {
	return (
		<div>
			<label htmlFor={id} className={formStyles.label}>
				{label}
			</label>
			<input
				type='text'
				id={id}
				value={value}
				onChange={onChangeAction}
				placeholder={placeholder}
				className={formStyles.input}
				autoComplete='off'
			/>
		</div>
	)
}

export default PersonInput
