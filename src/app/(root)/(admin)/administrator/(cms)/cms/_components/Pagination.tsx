'use client'

import { useCategoryStore } from '@/store/categoryStore'
import { CONFIG_BLOG } from '../CONFIG_BLOG'

export const Pagination = () => {
	const {
		totalPages,
		totalItems,
		currentPage,
		itemsPerPage,
		setCurrentPage,
	} = useCategoryStore()

	const startItem = (currentPage - 1) * itemsPerPage + 1
	const endItem = Math.min(currentPage * itemsPerPage, totalItems)

	const handlePageChange = (pageNum: number) => {
		setCurrentPage(pageNum)
	}

	const baseButtonClass =
		'flex items-center justify-center rounded-lg border text-sm font-medium cursor-pointer transition-all duration-300 ' +
		'focus:outline-none focus:ring-2 focus:ring-orange-500/40 ' +
		'disabled:cursor-not-allowed disabled:opacity-45'

	const secondaryButtonClass =
		'border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 ' +
		'dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-orange-500 dark:hover:bg-orange-500/10 dark:hover:text-orange-400'

	const activeButtonClass =
		'border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange-500/25 ' +
		'hover:border-orange-600 hover:bg-orange-600 ' +
		'dark:border-orange-400 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-400'

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
		<div className='border-t border-gray-200 px-6 py-4 dark:border-neutral-800'>
			<div className='flex flex-wrap gap-3 items-center justify-between'>
				<div className='text-sm text-gray-600 dark:text-neutral-400'>
					Показано{' '}
					<span className='font-medium text-gray-900 dark:text-neutral-100'>
						{startItem}-{endItem}
					</span>{' '}
					из{' '}
					<span className='font-medium text-gray-900 dark:text-neutral-100'>
						{totalItems}
					</span>{' '}
					элементов
					<span className='mx-2 text-gray-400 dark:text-neutral-600'>
						•
					</span>
					Страница{' '}
					<span className='font-medium text-gray-900 dark:text-neutral-100'>
						{currentPage}
					</span>{' '}
					из{' '}
					<span className='font-medium text-gray-900 dark:text-neutral-100'>
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
