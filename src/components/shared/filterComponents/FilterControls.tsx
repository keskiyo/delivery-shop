'use client'

/**
 * Управление фильтрами (десктопная версия)
 * 
 * Функционал:
 * - Отображает активные фильтры (кнопка с количеством)
 * - Показывает диапазон цен если установлен
 * - Кнопка "Очистить фильтры" для сброса всех фильтров
 * - Отдельная кнопка для очистки только ценового диапазона
 * 
 * Логика:
 * - Читает параметры из URL: priceFrom, priceTo, filter
 * - Подсчитывает количество активных фильтров
 * - Динамически меняет текст кнопки (Фильтры / Фильтр 1 / Фильтры N)
 * - Активные фильтры: зеленый фон, неактивные: серый
 * 
 * @param basePath - Базовый путь страницы для формирования ссылок
 */
import { X } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function FilterControlsContent({
	basePath,
}: {
	activeFilter?: string | string[]
	basePath: string
}) {
	const searchParams = useSearchParams()

	const minPrice = searchParams.get('priceFrom')
	const maxPrice = searchParams.get('priceTo')
	const activeFilter = searchParams.getAll('filter')

	function buildClearFiltersLink() {
		const params = new URLSearchParams()

		if (searchParams.get('page'))
			params.set('page', searchParams.get('page') || '')

		if (searchParams.get('itemsPerPage'))
			params.set('itemsPerPage', searchParams.get('itemsPerPage') || '')

		params.delete('filter')
		params.delete('priceFrom')
		params.delete('priceTo')

		return `${basePath}?${params.toString()}`
	}

	const hasPriceFilter = minPrice || maxPrice

	const buildClearPriceFilterLink = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete('priceFrom')
		params.delete('priceTo')

		return `${basePath}?${params.toString()}`
	}

	const activeFilterCount =
		(activeFilter
			? Array.isArray(activeFilter)
				? activeFilter.length
				: 1
			: 0) + (hasPriceFilter ? 1 : 0)

	const filterButtonText =
		activeFilterCount === 0
			? 'Фильтры'
			: activeFilterCount === 1
				? 'Фильтр 1'
				: `Фильтры ${activeFilterCount}`

	return (
		<div className='flex flex-warp flex-row gap-4'>
			<div
				className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300 cursor-not-allowed gap-x-2 ${(activeFilter && activeFilter.length > 0) || hasPriceFilter ? 'bg-brand text-brand-foreground' : 'bg-surface text-text-soft'}`}
			>
				{filterButtonText}
			</div>
			{hasPriceFilter && (
				<div className='h-8 p-2 rounded text-xs flex justify-center items-center duration-300 gap-x-2 bg-brand text-brand-foreground'>
					<Link
						href={buildClearPriceFilterLink()}
						className='flex items-center gap-x-2'
					>
						Цена {minPrice !== undefined ? `от ${minPrice}` : ''}
						{maxPrice !== undefined ? `до ${maxPrice}` : ''}
						<X size={24} />
					</Link>
				</div>
			)}
			{activeFilterCount > 0 && (
				<div className='h-8 p-2 rounded text-xs flex justify-center items-center duration-300 gap-x-2 bg-brand text-brand-foreground'>
					<Link
						href={buildClearFiltersLink()}
						className='flex items-center gap-x-2'
					>
						Очистить фильтры
						<X size={24} />
					</Link>
				</div>
			)}
		</div>
	)
}

const FilterControls = ({
	basePath,
}: {
	activeFilter?: string | string[]
	basePath: string
}) => {
	return (
		<Suspense
			fallback={
				<div className='flex flex-wrap flex-row gap-4'>
					<div className='h-8 p-2 rounded text-xs bg-surface text-text-soft animate-pulse'>
						Фильтры
					</div>
				</div>
			}
		>
			<FilterControlsContent basePath={basePath} />
		</Suspense>
	)
}

export default FilterControls
