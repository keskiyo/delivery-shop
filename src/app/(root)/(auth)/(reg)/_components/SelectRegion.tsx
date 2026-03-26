'use client'

import { regions } from '@/data/regions'
import { ChevronDown } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { formStyles } from '../../styles'

interface SelectRegionProps {
	value: string
	onChangeAction: (e: ChangeEvent<HTMLSelectElement>) => void
	className?: string
	disabled?: boolean
}

const SelectRegion = ({
	value,
	onChangeAction,
	className,
	disabled,
}: SelectRegionProps) => {
	const [isFocused, setIsFocused] = useState(false)

	return (
		<div>
			<label htmlFor='region' className={formStyles.label}>
				Регион
			</label>
			<div className='relative'>
				<select
					id='region'
					name='region'
					value={value}
					disabled={disabled}
					onChange={onChangeAction}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					className={`${formStyles.input} ${className} appearance-none pr-8 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#f3f2f1]`}
				>
					{regions.map(region => (
						<option key={region.value} value={region.label}>
							{region.label}
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

export default SelectRegion
