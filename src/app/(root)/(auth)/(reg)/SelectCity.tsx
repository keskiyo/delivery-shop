'use client'

import { cities } from '@/data/city'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { formStyles } from '../styles'

const SelectCity = ({
	value,
	onChangeAction,
}: {
	value: string
	onChangeAction: (value: string) => void
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedLabel, setSelectedLabel] = useState('')
	const wrapperRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const selected = cities.find(c => c.value === value)
		setSelectedLabel(selected?.label || '')
	}, [value])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleSelect = (optionValue: string) => {
		onChangeAction(optionValue)
		setIsOpen(false)
	}

	return (
		<div ref={wrapperRef}>
			<label htmlFor='location' className={formStyles.label}>
				Населенный пункт
			</label>
			<div className='relative'>
				<button
					type='button'
					id='location'
					onClick={() => setIsOpen(!isOpen)}
					className={`${formStyles.input} appearance-none pr-8 cursor-pointer`}
				>
					{selectedLabel || 'Выберите населенный пункт'}
				</button>
				<div className='absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none'>
					{isOpen ? (
						<ChevronUp size={24} className='text-gray-600' />
					) : (
						<ChevronDown size={24} className='text-gray-600' />
					)}
				</div>
			</div>
			{isOpen && (
				<div className='absolute w-65 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto'>
					{cities.map(city => (
						<button
							key={city.value}
							type='button'
							onClick={() => handleSelect(city.value)}
							className='w-full px-3 py-2 text-left hover:bg-accent flex items-center justify-between cursor-pointer'
						>
							<span>{city.label}</span>
							{city.value === value && (
								<Check size={16} className='text-primary' />
							)}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default SelectCity
