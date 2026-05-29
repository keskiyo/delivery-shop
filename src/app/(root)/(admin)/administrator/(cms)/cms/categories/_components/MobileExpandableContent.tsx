import { MobileExpandableContentProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/types'
import React from 'react'

export const MobileExpandableContent = ({
	category,
	onDelete,
	onEdit,
}: MobileExpandableContentProps) => {
	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation()
		window.scrollTo({ top: 0, behavior: 'smooth' })
		onEdit(category)
	}
	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		onDelete(category._id.toString())
	}

	return (
		<div className='mt-4 space-y-3 pt-4 border-t border-border'>
			{category.description && (
				<div>
					<div className='text-xs font-medium mb-1'>Описание</div>
					<div
						className='wrap-break-words'
						title={category.description}
					>
						{category.description}
					</div>
				</div>
			)}

			<div>
				<div className='text-xs font-medium mb-1'>Автор</div>
				<div
					className='wrap-break-words'
					title={category.author || 'Неизвестен'}
				>
					{category.author || (
						<span className='text-center'>Неизвестен</span>
					)}
				</div>
			</div>

			{(category.keywords || []).length > 0 && (
				<div>
					<div className='text-xs font-medium mb-1'>
						Ключевые слова
					</div>
					<div className='flex flex-wrap gap-1'>
						{(category.keywords || []).map((keyword, index) => (
							<span
								key={index}
								className='inline-flex items-center bg-success-soft text-success text-xs px-2 py-1 rounded wrap-break-words max-w-full'
								title={keyword}
							>
								{keyword}
							</span>
						))}
					</div>
				</div>
			)}

			<div className='flex gap-2 pt-2'>
				<button
					onClick={handleEdit}
					className='flex-1 px-4 py-2 bg-brand text-white rounded hover:bg-brand-hover text-xs cursor-pointer duration-300'
					title='Редактировать категорию'
				>
					Редактировать
				</button>
				<button
					onClick={handleDelete}
					className='flex-1 px-4 py-2 bg-danger text-white rounded hover:bg-danger/90 text-xs cursor-pointer duration-300'
					title='Удалить категорию'
				>
					Удалить
				</button>
			</div>
		</div>
	)
}
