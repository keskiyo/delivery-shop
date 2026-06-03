'use client'

import { PaginationProps } from '@/types/paginationProps'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'


const createPageUrl = (
	basePath: string,
	params: URLSearchParams,
	page: number,
) => {
	const newParams = new URLSearchParams(params)
	newParams.set('page', page.toString())
	return `${basePath}?${newParams.toString()}`
}


const getVisiblePages = (totalPages: number, currentPage: number) => {
	if (totalPages <= 5) {
		return Array.from({ length: totalPages }, (_, i) => i + 1)
	}

	let start = Math.max(1, currentPage - 2)
	let end = Math.min(totalPages, currentPage + 2)

	if (currentPage <= 3) {
		end = 5
	} else if (currentPage >= totalPages - 2) {
		start = totalPages - 4
	}

	const pages: (number | string)[] = []

	if (start > 1) pages.push(1)

	if (start > 2) pages.push('...')

	for (let i = start; i <= end; i++) pages.push(i)

	if (end < totalPages - 1) pages.push('...')

	if (end < totalPages) pages.push(totalPages)

	return pages
}


const Pagination = ({
	totalItems,
	currentPage,
	basePath,
	itemsPerPage,
	searchQuery,
}: PaginationProps) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage)
	const params = new URLSearchParams(searchQuery)
	const visiblePages = getVisiblePages(totalPages, currentPage)

	const buttonSize =
		'w-5 h-5 md:w-10 md:h-10 flex items-center justify-center rounded duration-300'
	const buttonActive = 'text-text-soft hover:text-promo'
	const buttonDisabled = 'hidden cursor-not-allowed'
	const pageButtonClass = `${buttonSize}`

	return (
		<div className='flex justify-center mt-10 text-foreground text-sm md:text-base'>
			<nav className='flex gap-1 md:gap-2 items-center'>
				<Link
					href={createPageUrl(basePath, params, currentPage - 1)}
					aria-disabled={currentPage === 1}
					tabIndex={currentPage === 1 ? -1 : undefined}
					className={`${buttonSize} ${
						currentPage === 1 ? buttonDisabled : buttonActive
					}`}
				>
					<ChevronLeft size={20} />
				</Link>

				{visiblePages.map((page, index) => {
					if (page === '...') {
						return (
							<span
								key={`ellipsis-${index}`}
								className={`${buttonSize} text-promo`}
							>
								...
							</span>
						)
					}
					return (
						<Link
							key={page}
							href={createPageUrl(
								basePath,
								params,
								page as number,
							)}
							className={`${pageButtonClass} ${
								currentPage === page
									? 'text-promo border-2 border-promo'
									: 'hover:bg-promo hover:text-white'
							}`}
						>
							{page}
						</Link>
					)
				})}

				<Link
					href={createPageUrl(basePath, params, currentPage + 1)}
					aria-disabled={currentPage === totalPages}
					tabIndex={currentPage === totalPages ? -1 : undefined}
					className={`${buttonSize} ${
						currentPage === totalPages
							? buttonDisabled
							: buttonActive
					}`}
				>
					<ChevronRight size={20} />
				</Link>
			</nav>
		</div>
	)
}

export default Pagination
