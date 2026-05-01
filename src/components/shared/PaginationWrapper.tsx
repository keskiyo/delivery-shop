'use client'

/**
 * Обертка для пагинации с адаптивным количеством элементов на странице
 * 
 * Функционал:
 * - Автоматически подстраивает количество элементов на странице под размер экрана
 * - При Resize окна пересчитывает количество и сбрасывает на первую страницу
 * - Использует Suspense для поддержки SSR
 * - Обновляет URL параметры при изменении количества
 * 
 * Типы контента (contentType):
 * - 'article': 1 элемент на мобильном, 3 на десктопе
 * - 'category': 8 на мобильном, 6 на десктопе
 * - По умолчанию: 2/3/4 в зависимости от ширины экрана
 * 
 * @param totalItems - Общее количество элементов
 * @param currentPage - Текущая страница
 * @param basePath - Базовый путь для ссылок
 * @param contentType - Тип контента для адаптивного расчета
 */
import Pagination from '@/components/shared/Pagination'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { CONFIG } from '../../../config/config'
import { debounce } from '../../../utils/debounce'

/**
 * Вычисляет оптимальное количество элементов на странице в зависимости от ширины экрана
 * 
 * @param contentType - Тип контента ('article' | 'category' | undefined)
 * @returns Количество элементов на странице
 */
function getItemsPerPAgeByWidth(contentType?: string) {
	const width = window.innerWidth

	if (contentType === 'article') {
		return width < 640 ? 1 : 3
	}

	if (contentType === 'category') {
		return width < 768 ? 8 : 6
	}

	if (width < 768) return 2
	if (width < 1280) return 3
	return 4
}

function PaginationWrapperContent({
	totalItems,
	currentPage,
	basePath,
	contentType,
}: {
	totalItems: number
	currentPage: number
	basePath: string
	contentType?: string
}) {
	let initialItemsPerPage

	if (contentType === 'article') {
		initialItemsPerPage = 1
	} else if (contentType === 'category') {
		initialItemsPerPage = CONFIG.ITEMS_PER_PAGE_CATEGORY
	} else {
		initialItemsPerPage = CONFIG.ITEMS_PER_PAGE
	}

	const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)
	const searchParams = useSearchParams()
	const router = useRouter()

	useEffect(() => {
		const updateItemsPerPage = () => {
			const newItemsPerPage = getItemsPerPAgeByWidth(contentType)

			if (newItemsPerPage === itemsPerPage) return

			setItemsPerPage(newItemsPerPage)

			const params = new URLSearchParams(searchParams.toString())
			params.set('itemsPerPage', newItemsPerPage.toString())
			params.set('page', '1')

			router.replace(`${basePath}?${params.toString()}`, {
				scroll: false,
			})
		}

		updateItemsPerPage()
		const handleResize = debounce(updateItemsPerPage, 200)

		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [itemsPerPage, basePath, searchParams, router, contentType])

	return (
		<>
			<Pagination
				totalItems={totalItems}
				currentPage={currentPage}
				basePath={basePath}
				itemsPerPage={itemsPerPage}
				searchQuery={searchParams.toString()}
			/>
		</>
	)
}

const PaginationWrapper = ({
	totalItems,
	currentPage,
	basePath,
	contentType,
}: {
	totalItems: number
	currentPage: number
	basePath: string
	contentType?: string
}) => {
	return (
		<Suspense
			fallback={
				<div className='h-8 bg-gray-200 animate-pulse rounded'></div>
			}
		>
			<PaginationWrapperContent
				totalItems={totalItems}
				currentPage={currentPage}
				basePath={basePath}
				contentType={contentType}
			/>
		</Suspense>
	)
}

export default PaginationWrapper
