import { Check } from 'lucide-react'
import { memo } from 'react'

interface SelectionCheckboxProps {
	isSelected: boolean
	onSelectionChange: (isSelected: boolean) => void
}

const SelectionCheckbox = memo(function SelectionCheckbox({
	isSelected,
	onSelectionChange,
}: SelectionCheckboxProps) {
	return (
		<label className='rounded bg-card p-1.5 flex items-center cursor-pointer z-20 absolute top-2 transition-all duration-300'>
			<input
				type='checkbox'
				checked={isSelected}
				onChange={e => onSelectionChange(e.target.checked)}
				className='hidden'
			/>
			<span
				className={`
          w-5 h-5 border rounded flex items-center justify-center duration-300
          ${isSelected ? 'bg-brand border-brand' : 'bg-card border-border'}
        `}
			>
				{isSelected && (
					<Check
						className='text-brand-foreground w-4 h-4 shrink-0 '
						strokeWidth={4}
					/>
				)}
			</span>
		</label>
	)
})

export default SelectionCheckbox
