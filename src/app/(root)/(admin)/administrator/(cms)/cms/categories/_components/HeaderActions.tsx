import { HeaderActionsProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/types'
import { Plus } from 'lucide-react'

export function HeaderActions({ onCreate }: HeaderActionsProps) {
	return (
		<div className='flex justify-between items-center mb-4'>
			<div className='flex gap-2'>
				<button
					onClick={onCreate}
					className='px-4 py-2 bg-brand text-white rounded hover:bg-brand-hover flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-custom'
				>
					<Plus className='w-5 h-5' />
					Новая категория
				</button>
			</div>
		</div>
	)
}
