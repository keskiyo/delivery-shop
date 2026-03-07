'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const FilterControls = ({
	basePath,
}: {
	activeFilter?: string | string[]
	basePath: string
}) => {
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
				className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300 cursor-not-allowed gap-x-2 ${(activeFilter && activeFilter.length > 0) || hasPriceFilter ? 'bg-green-600 text-white' : 'bg-[#f3f2f1] text-[#606060]'}`}
			>
				{filterButtonText}
			</div>
			{hasPriceFilter && (
				<div className='h-8 p-2 rounded text-xs flex justify-center items-center duration-300 gap-x-2 bg-green-600 text-white'>
					<Link
						href={buildClearPriceFilterLink()}
						className='flex items-center gap-x-2'
					>
						Цена {minPrice !== undefined ? `от ${minPrice}` : ''}
						{maxPrice !== undefined ? `до ${maxPrice}` : ''}
						<X size={24} style={{ filter: 'text-white' }} />
					</Link>
				</div>
			)}
			{activeFilterCount > 0 && (
				<div className='h-8 p-2 rounded text-xs flex justify-center items-center duration-300 gap-x-2 bg-green-600 text-white'>
					<Link
						href={buildClearFiltersLink()}
						className='flex items-center gap-x-2'
					>
						Очистить фильтры
						<X size={24} style={{ filter: 'text-white' }} />
					</Link>
				</div>
			)}
		</div>
	)
}

export default FilterControls
