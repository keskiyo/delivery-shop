'use client'

import { PaginationProps } from '@/types/paginationProps'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

/**
 * Создает URL для страницы пагинации с сохранением всех query параметров
 *
 * @param basePath - Базовый путь (например, '/catalog/meat')
 * @param params - Текущие query параметры
 * @param page - Номер страницы
 * @returns Полный URL с обновленным параметром page
 */
const createPageUrl = (
	basePath: string,
	params: URLSearchParams,
	page: number,
) => {
	const newParams = new URLSearchParams(params)
	newParams.set('page', page.toString())
	return `${basePath}?${newParams.toString()}`
}

/**
 * Вычисляет видимые номера страниц для пагинации
 *
 * Логика:
 * - Если страниц <= 5: показываем все
 * - Иначе: показываем текущую страницу ± 2 страницы
 * - Добавляем первую и последнюю страницу
 * - Добавляем "..." где есть пропуски
 *
 * @param totalPages - Общее количество страниц
 * @param currentPage - Текущая страница
 * @returns Массив номеров страниц и "..." для отображения
 *
 * @example
 * getVisiblePages(10, 5) // [1, '...', 3, 4, 5, 6, 7, '...', 10]
 * getVisiblePages(3, 2) // [1, 2, 3]
 */
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

/**
 * Компонент пагинации для навигации по страницам
 *
 * Функционал:
 * - Кнопки перехода: первая, предыдущая, следующая, последняя
 * - Отображение номеров страниц с умной логикой (показывает текущую ± 2)
 * - Сохраняет все query параметры при переходе между страницами
 * - Отключает кнопки на граничных страницах
 *
 * @param totalItems - Общее количество элементов
 * @param currentPage - Текущая страница (начинается с 1)
 * @param basePath - Базовый путь для ссылок
 * @param itemsPerPage - Количество элементов на странице
 * @param searchQuery - Строка с query параметрами
 *
 * @example
 * <Pagination
 *   totalItems={100}
 *   currentPage={3}
 *   basePath="/catalog/meat"
 *   itemsPerPage={10}
 *   searchQuery="?sort=price&inStock=true"
 * />
 */
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
	const buttonActive = 'dark:text-white hover:text-[#ff7345]'
	const buttonDisabled = 'hidden cursor-not-allowed'
	const pageButtonClass = `${buttonSize}`

	return (
		<div className='flex justify-center mt-10 dark:text-white text-sm md:text-base'>
			<nav className='flex gap-1 md:gap-2 items-center'>
				{/* <Link
					href={createPageUrl(basePath, params, 1)}
					aria-disabled={currentPage === 1}
					tabIndex={currentPage === 1 ? -1 : undefined}
					className={`${buttonSize} ${
						currentPage === 1 ? buttonDisabled : buttonActive
					}`}
				>
					<ChevronsLeft size={22} />
				</Link> */}
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
								className={`${buttonSize} text-[#ff6633]`}
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
									? 'text-[#ff6633] border-2 border-[#ff6633]'
									: 'hover:bg-[#ff6633] light:hover:text-white'
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

				{/* <Link
					href={createPageUrl(basePath, params, totalPages)}
					aria-disabled={currentPage === totalPages}
					tabIndex={currentPage === totalPages ? -1 : undefined}
					className={`${buttonSize} ${
						currentPage === totalPages
							? buttonDisabled
							: buttonActive
					}`}
				>
					<ChevronsRight size={22} />
				</Link> */}
			</nav>
		</div>
	)
}

export default Pagination
