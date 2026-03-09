'use client'

import { ChangeEvent } from 'react'
import { formStyles } from '../styles'

const EmailInput = ({
	value,
	onChangeAction,
}: {
	value: string
	onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void
}) => {
	return (
		<div>
			<label htmlFor='email' className={formStyles.label}>
				E-mail
			</label>
			<input
				id='email'
				type='email'
				value={value}
				onChange={onChangeAction}
				className={formStyles.input}
				placeholder='example@example.com'
			/>
		</div>
	)
}

export default EmailInput
