import { MobileCategoryHeaderProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/types'

export const MobileCategoryHeader = ({
	category,
	displayNumericId,
}: MobileCategoryHeaderProps) => (
	<div className='flex-1 min-w-0'>
		<div className='flex items-center gap-2 mb-1'>
			<span
				className='inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium shrink-0'
				title='Порядковый номер'
			>
				{displayNumericId || '—'}
			</span>
			<h3
				className='font-medium text-lg wrap-break-word'
				title={category.name}
			>
				{category.name}
			</h3>
		</div>

		<div className='flex flex-wrap items-center gap-2 mt-2'>
			<code
				className='text-xs px-2 py-1 rounded font-mono break-all'
				title='Ссылка (slug)'
			>
				{category.slug}
			</code>
			<span
				className='text-xs shrink-0'
				title={`Дата создания: ${new Date(category.createdAt).toLocaleDateString('ru-RU')}`}
			>
				{new Date(category.createdAt).toLocaleDateString('ru-RU')}
			</span>
		</div>
	</div>
)
