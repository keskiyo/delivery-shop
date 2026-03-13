'use client'

import { formStyles } from '@/app/(root)/(auth)/styles'
import { regions } from '@/data/regions'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const SelectRegion = ({
	value,
	onChangeAction,
	regions: regionsProp,
}: {
	value: string
	onChangeAction: (value: string) => void
	regions?: Array<{ value: string; label: string }>
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedLabel, setSelectedLabel] = useState('')
	const wrapperRef = useRef<HTMLDivElement>(null)
	const regionsData = regionsProp || regions

	useEffect(() => {
		const selected = regionsData.find(r => r.value === value)
		setSelectedLabel(selected?.label || '')
	}, [value, regionsData])

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
			<label htmlFor='region' className={formStyles.label}>
				Регион
			</label>
			<div className='relative'>
				<button
					type='button'
					id='region'
					onClick={() => setIsOpen(!isOpen)}
					className={`${formStyles.input} appearance-none pr-8 cursor-pointer`}
				>
					{selectedLabel || 'Выберите регион'}
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
					{regionsData.map(region => (
						<button
							key={region.value}
							type='button'
							onClick={() => handleSelect(region.value)}
							className='w-full px-3 py-2 text-left hover:bg-accent flex items-center justify-between cursor-pointer'
						>
							<span>{region.label}</span>
							{region.value === value && (
								<Check size={16} className='text-primary' />
							)}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default SelectRegion
