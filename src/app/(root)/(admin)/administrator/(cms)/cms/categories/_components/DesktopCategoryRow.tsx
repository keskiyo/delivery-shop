import { SortableItemProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/types'
import { Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { DragHandle } from './DragHandle'

export const DesktopCategoryRow = ({
	category,
	displayNumericId,
	onDelete,
	onEdit,
	isDragging = false,
}: SortableItemProps) => {
	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation()
		onEdit(category)
	}

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		onDelete(category._id.toString())
	}
	return (
		<div
			className={`p-4 hover:bg-surface-hover text-sm duration-200 ${
				isDragging
					? 'opacity-60 bg-brand-soft shadow-lg border-2 border-brand transform scale-[0.995]'
					: 'hover:shadow-sm'
			}`}
		>
			<div className='grid grid-cols-[0.3fr_0.5fr_1fr_2fr_2fr_2fr_2fr_1fr_1fr_2fr] gap-2 items-center'>
				<div>
					<DragHandle />
				</div>

				<div className='flex justify-center'>
					<span
						className='inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium shrink-0'
						title='Порядковый номер'
					>
						{displayNumericId || '-'}
					</span>
				</div>

				<div className='flex items-center justify-center'>
					{category.image ? (
						<Image
							src={category.image}
							alt={category.imageAlt || category.name}
							width={50}
							height={50}
							className='object-cover rounded border border-border'
							title={category.imageAlt}
						/>
					) : (
						<div className='w-10 h-10 rounded flex items-center justify-center'>
							<span className='text-xs'>Нет</span>
						</div>
					)}
				</div>

				<div className='min-w-0'>
					<div
						className='font-medium wrap-break-words'
						title={category.name}
					>
						{category.name}
					</div>
				</div>

				<div className='min-w-0'>
					<div
						className='text-xs px-2 py-1 rounded break-all font-mono'
						title={`Ссылка: ${category.slug}`}
					>
						{category.slug}
					</div>
				</div>

				<div className='min-w-0'>
					<div
						className='wrap-break-words'
						title={category.description || 'Нет описания'}
					>
						{category.description || <span>—</span>}
					</div>
				</div>

				<div className='min-w-0'>
					<div className='flex flex-wrap gap-1 justify-center'>
						{category.keywords && category.keywords.length > 0 ? (
							category.keywords.map((keyword, index) => (
								<span
									key={index}
									className='inline-flex items-center bg-success-soft text-success text-xs px-2 py-1 rounded wrap-break-word max-w-full'
									title={keyword}
								>
									{keyword}
								</span>
							))
						) : (
							<span
								className='text-center'
								title='Нет ключевых слов'
							>
								—
							</span>
						)}
					</div>
				</div>

				<div className='min-w-0 flex justify-center'>
					<div
						className='text-xs wrap-break-word text-center'
						title={category.author || 'Автор неизвестен'}
					>
						{category.author || <span>—</span>}
					</div>
				</div>

				<div className='min-w-0'>
					<div
						className='text-xs wrap-break-word'
						title={`Дата создания: ${new Date(category.createdAt).toLocaleDateString('ru-RU')}`}
					>
						{new Date(category.createdAt).toLocaleDateString(
							'ru-RU',
						)}
					</div>
				</div>

				<div className='min-w-0'>
					<div className='flex gap-2 justify-center'>
						<button
							onClick={handleEdit}
							className='p-2 bg-brand text-white rounded hover:bg-brand-hover flex items-center justify-center cursor-pointer duration-300 shrink-0'
							title='Редактировать категорию'
						>
							<Edit className='w-4 h-4' />
						</button>
						<button
							onClick={handleDelete}
							className='p-2 bg-danger text-white rounded hover:bg-danger/90 flex items-center justify-center cursor-pointer duration-300 shrink-0'
							title='Удалить категорию'
						>
							<Trash2 className='w-4 h-4' />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
