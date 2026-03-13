'use client'

import Tooltip from '@/app/(root)/(auth)/_components/Tooltip'
import { formStyles } from '@/app/(root)/(auth)/styles'
import { validateBirthDate } from '@/utils/validation/validateBirthDate'
import { CalendarDays } from 'lucide-react'
import { ChangeEvent, useRef, useState } from 'react'

const DateInput = ({
	value,
	onChangeAction,
}: {
	value: string
	onChangeAction: (value: string) => void
}) => {
	const [showTooltip, setShowTooltip] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const formatDate = (input: string): string => {
		const cleaned = input.replace(/\D/g, '')
		let formatted = ''
		if (cleaned.length > 0) formatted = cleaned.slice(0, 2)
		if (cleaned.length > 2) formatted += '.' + cleaned.slice(2, 4)
		if (cleaned.length > 4) formatted += '.' + cleaned.slice(4, 8)

		return formatted
	}

	const handleDateChange = (formattedDate: string) => {
		const validation = validateBirthDate(formattedDate)
		setError(validation.error || null)
		setShowTooltip(!!validation.error)
		onChangeAction(formattedDate)
	}

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const formatted = formatDate(e.target.value)
		handleDateChange(formatted)
	}

	const handleFocus = () => {
		setShowTooltip(true)
		if (value && value.length >= 10) {
			const validation = validateBirthDate(value)
			setError(validation.error || null)
		}
	}

	const handleCalendarClick = () => {
		if (!inputRef.current) return
		const tempInput = document.createElement('input')

		tempInput.type = 'date'
		tempInput.style.position = 'fixed'
		tempInput.style.opacity = '0'
		tempInput.style.pointerEvents = 'none'
		tempInput.style.zIndex = '9999'
		tempInput.max = new Date().toISOString().split('T')[0]

		const rect = inputRef.current.getBoundingClientRect()
		tempInput.style.left = `${rect.right + 8}px`
		tempInput.style.top = `${rect.top + rect.height / 5 - 31}px`

		let isCleanedUp = false
		const cleanup = () => {
			if (isCleanedUp) return
			isCleanedUp = true
			if (document.body.contains(tempInput)) {
				document.body.removeChild(tempInput)
			}
		}

		const handleClickOutside = (e: MouseEvent) => {
			if (!tempInput.contains(e.target as Node)) cleanup()
		}

		document.addEventListener('mousedown', handleClickOutside)
		tempInput.onchange = e => {
			const target = e.target as HTMLInputElement
			if (target.value) {
				const [year, month, day] = target.value.split('-')
				const formatted = `${day}.${month}.${year}`
				handleDateChange(formatted)
			}
			cleanup()
		}

		document.body.appendChild(tempInput)
		try {
			tempInput.showPicker()
		} catch {
			tempInput.click()
		}
	}

	return (
		<div className='relative'>
			<label htmlFor='birthdayDate' className={formStyles.label}>
				Дата рождения
			</label>
			<div className='relative'>
				<input
					id='birthdayDate'
					type='text'
					value={value}
					onChange={handleInputChange}
					onFocus={handleFocus}
					onBlur={() => setShowTooltip(false)}
					placeholder='дд.мм.гггг'
					className={`${formStyles.input} pr-8`}
					maxLength={10}
					ref={inputRef}
				/>
				<button
					type='button'
					onClick={handleCalendarClick}
					className='absolute right-2 top-1/2 transform -translate-y-1/2'
					aria-label='Установить дату рождения'
				>
					<CalendarDays size={24} className='text-gray-600' />
				</button>
			</div>
			{showTooltip && error && <Tooltip text={error} show={true} />}
		</div>
	)
}

export default DateInput
