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
				className={`w-4 h-4 ml-1 transition-transform transition-custom ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
			/>
		)
	}

	return (
		<div className='hidden lg:block border border-border'>
			<div className='grid lg:grid-cols-[32px_40px_50px_100px_80px_120px_120px_80px_80px_80px_100px]  xl:grid-cols-[32px_40px_50px_120px_80px_160px_160px_80px_80px_80px_100px] gap-2 items-center justify-between'>
				<div className='w-8'></div>
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
					title='Сортировать по кол-ву статей'
					onClick={() => handleSort('articles')}
				>
					Статей {renderSortItem('articles')}
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
