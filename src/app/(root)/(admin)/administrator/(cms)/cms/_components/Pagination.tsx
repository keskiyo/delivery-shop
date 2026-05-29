'use client'

import { useCategoryStore } from '@/store/categoryStore'
import { useArticlesManagementStore } from '@/store/articlesManagementStore'
import { CONFIG_BLOG } from '../CONFIG_BLOG'

export const Pagination = ({ type = 'categories' }: { type?: 'categories' | 'articles' }) => {
	const categoryPagination = useCategoryStore()
	const articlePagination = useArticlesManagementStore()
	const {
		totalPages,
		totalItems,
		currentPage,
		itemsPerPage,
		setCurrentPage,
	} = type === 'articles' ? articlePagination : categoryPagination

	const startItem = (currentPage - 1) * itemsPerPage + 1
	const endItem = Math.min(currentPage * itemsPerPage, totalItems)

	const handlePageChange = (pageNum: number) => {
		setCurrentPage(pageNum)
	}

	const baseButtonClass =
		'flex items-center justify-center rounded-lg border text-sm font-medium cursor-pointer transition-all duration-300 ' +
		'focus:outline-none focus:ring-2 focus:ring-brand/40 ' +
		'disabled:cursor-not-allowed disabled:opacity-45'

	const secondaryButtonClass =
		'border-border bg-card text-foreground hover:border-promo hover:bg-promo-soft hover:text-promo'

	const activeButtonClass =
		'border-promo bg-promo text-white shadow-sm shadow-orange-500/25 hover:border-promo-hover hover:bg-promo-hover'

	const renderPageButtons = () => {
		const buttons = []
		const maxVisibleButtons = CONFIG_BLOG.MAX_VISIBLE_BUTTONS

		if (totalPages <= maxVisibleButtons) {
			for (let i = 1; i <= totalPages; i++) {
				buttons.push(i)
			}
		} else if (currentPage <= 3) {
			for (let i = 1; i <= maxVisibleButtons; i++) {
				buttons.push(i)
			}
		} else if (currentPage >= totalPages - 2) {
			for (
				let i = totalPages - maxVisibleButtons + 1;
				i <= totalPages;
				i++
			) {
				buttons.push(i)
			}
		} else {
			for (let i = currentPage - 2; i <= currentPage + 2; i++) {
				buttons.push(i)
			}
		}

		return buttons.map(pageNum => (
			<button
				key={pageNum}
				onClick={() => handlePageChange(pageNum)}
				className={`${baseButtonClass} h-11 w-11 ${
					currentPage === pageNum
						? activeButtonClass
						: secondaryButtonClass
				}`}
			>
				{pageNum}
			</button>
		))
	}

	return (
		<div className='border-t border-border px-6 py-4'>
			<div className='flex flex-wrap gap-3 items-center justify-between'>
				<div className='text-sm text-muted-foreground'>
					Показано{' '}
					<span className='font-medium text-foreground'>
						{startItem}-{endItem}
					</span>{' '}
					из{' '}
					<span className='font-medium text-foreground'>
						{totalItems}
					</span>{' '}
					элементов
					<span className='mx-2 text-muted-foreground'>
						•
					</span>
					Страница{' '}
					<span className='font-medium text-foreground'>
						{currentPage}
					</span>{' '}
					из{' '}
					<span className='font-medium text-foreground'>
						{totalPages}
					</span>
				</div>

				<div className='flex flex-wrap gap-2'>
					<button
						onClick={() =>
							handlePageChange(Math.max(1, currentPage - 1))
						}
						disabled={currentPage === 1}
						className={`${baseButtonClass} ${secondaryButtonClass} h-11 px-4`}
					>
						Назад
					</button>

					{renderPageButtons()}

					<button
						onClick={() =>
							handlePageChange(
								Math.min(totalPages, currentPage + 1),
							)
						}
						disabled={currentPage === totalPages}
						className={`${baseButtonClass} ${secondaryButtonClass} h-11 px-4`}
					>
						Вперед
					</button>
				</div>
			</div>
		</div>
	)
}
