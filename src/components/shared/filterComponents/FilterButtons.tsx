'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const FILTERS = [
	{ key: 'our-production', label: 'Товары нашего производства' },
	{ key: 'healthy-food', label: 'Полезные продукты' },
	{ key: 'non-gmo', label: 'Без ГМО' },
]

function FilterButtonsContent({ basePath }: { basePath: string }) {
	const searchParams = useSearchParams()
	const currentFilters = searchParams.getAll('filter')

	const buildFilterLink = (filterkey: string) => {
		const params = new URLSearchParams(searchParams.toString())

		if (currentFilters.includes(filterkey)) {
			params.delete('filter', filterkey)
			currentFilters
				.filter(f => f !== filterkey)
				.forEach(f => params.append('filter', f))
		} else {
			params.append('filter', filterkey)
		}

		params.delete('page')

		return `${basePath}?${params.toString()}`
	}

	const isFilterActive = (filterkey: string) =>
		currentFilters.includes(filterkey)

	return (
		<div className='flex flex-wrap flex-row gap-4 items-center'>
			{FILTERS.map(filter => (
				<Link
					key={filter.key}
					href={buildFilterLink(filter.key)}
					className={`h-8 p-2 text-xs flex justify-center items-center duration-300 cursor-pointer rounded-2xl ${
						isFilterActive(filter.key)
							? 'bg-green-600 text-white hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active)'
							: 'bg-[#f3f2f1] text-[#606060] hover:shadow-(--shadow-button-secondary) active:shadow-(--shadow-button-active)'
					} `}
				>
					{filter.label}
				</Link>
			))}
		</div>
	)
}

const FilterButtons = ({ basePath }: { basePath: string }) => {
	return (
		<Suspense
			fallback={
				<div className='flex flex-row flex-wrap gap-4 items-center mb-10'>
					{FILTERS.map(filter => (
						<div
							key={filter.key}
							className='h-8 p-2 rounded text-xs bg-[#f3f2f1] text-[#606060] animate-pulse'
						>
							{filter.label}
						</div>
					))}
				</div>
			}
		>
			<FilterButtonsContent basePath={basePath} />
		</Suspense>
	)
}

export default FilterButtons
