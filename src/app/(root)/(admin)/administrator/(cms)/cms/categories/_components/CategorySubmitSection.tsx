import { SubmitSectionProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/types'
import { useCategoryStore } from '@/store/categoryStore'
import { Loader2, Save } from 'lucide-react'

export const CategorySubmitSection = ({ onCancel }: SubmitSectionProps) => {
	const { editingId, isUploading, isSubmitting } = useCategoryStore()
	return (
		<>
			{isSubmitting && (
				<div className='mt-4 p-3 bg-brand-soft text-brand rounded text-sm border border-brand/30'>
					<div className='flex items-center gap-2'>
						<Loader2 className='w-4 h-4 animate-spin' />
						{'Создаем категорию...'}
					</div>
				</div>
			)}
			<div className='flex flex-wrap gap-3 mt-6'>
				<button
					type='submit'
					disabled={isUploading || isSubmitting}
					className='flex w-full items-center gap-1 text-xs md:text-base px-4 py-2.5 bg-brand text-white rounded hover:bg-brand-hover cursor-pointer transition-custom disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none focus:ring-3 focus:ring-brand/30'
				>
					<Save className='w-4 h-4 shrink-0' />
					{isSubmitting
						? 'Сохранение...'
						: editingId
							? 'Сохранить изменения'
							: 'Создать категорию'}
				</button>
				<button
					type='button'
					onClick={onCancel}
					disabled={isUploading || isSubmitting}
					className='px-4 py-2.5 w-full border border-border rounded cursor-pointer transition-custom disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none focus:ring-3 focus:ring-brand/20 hover:bg-surface-hover'
				>
					Отмена
				</button>
			</div>
		</>
	)
}
