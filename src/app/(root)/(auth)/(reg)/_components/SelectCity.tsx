'use client'

import { cities } from '@/data/city'
import { ChevronDown } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { formStyles } from '../../styles'

interface SelectCityProps {
	value: string
	onChangeAction: (e: ChangeEvent<HTMLSelectElement>) => void
	className?: string
	disabled?: boolean
}

const SelectCity = ({
	value,
	onChangeAction,
	className,
	disabled,
}: SelectCityProps) => {
	const [isFocused, setIsFocused] = useState(false)

	return (
		<div>
			<label htmlFor='location' className={formStyles.label}>
				Населенный пункт
			</label>
			<div className='relative'>
				<select
					id='location'
					name='location'
					value={value}
					disabled={disabled}
					onChange={onChangeAction}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					className={`${formStyles.input} ${className} appearance-none pr-8 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#f3f2f1]`}
				>
					{cities.map(city => (
						<option key={city.value} value={city.label}>
							{city.label}
						</option>
					))}
				</select>
				{!disabled && (
					<div className='absolute right-2 top-2 transform -transform-y-1/2 pointer-events-none'>
						<ChevronDown
							size={24}
							className={`transform transition-transform duration-300 ${
								isFocused ? 'rotate-180' : 'rotate-0'
							}`}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default SelectCity
