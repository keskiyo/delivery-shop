import { SortField } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/types'
import { useCategoryStore } from '@/store/categoryStore'
import { ChevronUp, ImageIcon } from 'lucide-react'

export const TableHeader = () => {
	const {
		sortField,
		sortDirection,
		setSortField,
		setSortDirection,
		loadCategories,
		currentPage,
		searchQuery,
		filterType,
	} = useCategoryStore()

	const handleSort = async (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
		} else {
			setSortField(field)
			setSortDirection('asc')
		}
		await loadCategories({
			page: currentPage,
			search: searchQuery,
			filterType,
		})
	}

	const renderSortItem = (field: SortField) => {
		if (sortField !== field) return null

		return (
			<ChevronUp
				className={`w-4 h-4 ml-1 transition-transform duration-200 ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
			/>
		)
	}

	return (
		<div className='hidden lg:block border border-border'>
			<div className='grid grid-cols-[0.3fr_0.5fr_1fr_2fr_2fr_2fr_2fr_1fr_1fr_2fr] gap-2 px-2 py-4 bg-card border-b border-border text-xs font-medium uppercase tracking-wider'>
				<div></div>
				<div
					className='text-center cursor-pointer hover:text-text-soft flex items-center justify-center'
					title='Сортировать по ID'
					onClick={() => handleSort('numericId')}
				>
					ID {renderSortItem('numericId')}
				</div>
				<div
					className='text-center flex items-center justify-center'
					title='Изображение категории'
				>
					<ImageIcon className='w-4 h-4' />
				</div>

				<div
					className='cursor-pointer hover:text-text-soft flex items-center'
					title='Сортировать по названию'
					onClick={() => handleSort('name')}
				>
					Название {renderSortItem('name')}
				</div>
				<div
					className='cursor-pointer hover:text-text-soft flex items-center'
					title='Сортировать по алиасу'
					onClick={() => handleSort('slug')}
				>
					Алиас {renderSortItem('slug')}
				</div>
				<div>Описание</div>
				<div className='text-center'>Ключевые слова</div>
				<div
					className='text-center cursor-pointer hover:text-text-soft flex items-center justify-center'
					title='Сортировать по автору'
					onClick={() => handleSort('author')}
				>
					Автор {renderSortItem('author')}
				</div>
				<div
					className='cursor-pointer hover:text-text-soft flex items-center'
					title='Сортировать по дате создания'
					onClick={() => handleSort('createdAt')}
				>
					Создана {renderSortItem('createdAt')}
				</div>
				<div className='text-center'>Действия</div>
			</div>
		</div>
	)
}
