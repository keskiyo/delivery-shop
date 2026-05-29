import { FilterControlsProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/types'
import { useCategoryStore } from '@/store/categoryStore'
import { Filter, X } from 'lucide-react'
import { useState } from 'react'

export const FilterControls = ({ onToggleFilters }: FilterControlsProps) => {
	const {
		filterType,
		sortField,
		sortDirection,
		searchQuery,
		setFilterType,
		setSortField,
		setSortDirection,
		handleSearchChange,
		loadCategories,
	} = useCategoryStore()

	const [localShowFilters, setLocalShowFilters] = useState(false)

	const hasActiveFilters = Boolean(
		filterType !== 'all' ||
		sortField !== 'numericId' ||
		sortDirection !== 'asc' ||
		searchQuery !== '',
	)

	const resetFilters = () => {
		handleSearchChange('')
		setFilterType('all')
		setSortField('numericId')
		setSortDirection('asc')
		loadCategories({ page: 1, search: '' })
	}

	const handleToggleFilters = () => {
		const newValue = !localShowFilters
		setLocalShowFilters(newValue)
		if (onToggleFilters) {
			onToggleFilters(newValue)
		}
	}

	return (
		<div className='flex items-center gap-2'>
			<button
				onClick={handleToggleFilters}
				className={`flex items-center gap-2 px-4 py-2 border rounded cursor-pointer duration-300 border-border ${
					localShowFilters ? 'bg-surface-hover' : 'hover:bg-surface-hover'
				}`}
				title={localShowFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
			>
				<Filter className='w-4 h-4' />
				<span className='hidden sm:inline'>Фильтры</span>
			</button>

			{hasActiveFilters && (
				<button
					onClick={resetFilters}
					className='flex items-center gap-2 px-4 py-2 border border-border rounded hover:bg-surface-hover cursor-pointer duration-300'
					title='Сбросить все фильтры'
				>
					<X className='w-4 h-4' />
					<span className='hidden sm:inline'>Сбросить</span>
				</button>
			)}
		</div>
	)
}
