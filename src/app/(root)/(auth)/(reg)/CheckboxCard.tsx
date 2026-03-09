'use client'

import { Check } from 'lucide-react'
import { ChangeEvent } from 'react'

const CheckboxCard = ({
	checked,
	onChangeAction,
}: {
	checked: boolean
	onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void
}) => {
	return (
		<div className='flex items-center gap-2'>
			<label
				htmlFor='hasCard'
				className='inline-flex items-center cursor-pointer'
			>
				<input
					type='checkbox'
					id='hasCard'
					checked={checked}
					onChange={onChangeAction}
					className='absolute opacity-0 h-0 w-0'
				/>
				<span
					className={`relative w-5 h-5 border rounded flex items-center justify-center duration-300 ${
						checked
							? 'bg-green-600 border-green-600'
							: 'bg-white border-[#bfbfbf]'
					}`}
				>
					{checked && <Check size={16} className='text-white' />}
				</span>
				<span className='ml-2 text-[#8f8f8f]'>
					{'У меня нет карты лояльности'}
				</span>
			</label>
		</div>
	)
}

export default CheckboxCard
