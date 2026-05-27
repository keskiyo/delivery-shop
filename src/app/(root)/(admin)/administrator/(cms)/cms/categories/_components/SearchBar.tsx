import { useCategoryStore } from '@/store/categoryStore'
import { Search, X } from 'lucide-react'

export const SearchBar = () => {
	const {
		searchQuery,
		handleSearchChange,
		handleSearchClear,
		loadCategories,
		setCurrentPage,
	} = useCategoryStore()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleSearchChange(e.target.value)
	}

	const handleClear = async () => {
		handleSearchClear()
		setCurrentPage(1)
		await loadCategories({ page: 1, search: '' })
	}

	const handleSearchClick = async () => {
		if (searchQuery.trim() !== '') {
			setCurrentPage(1)
			await loadCategories({ page: 1, search: searchQuery })
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleSearchClick()
		}
	}

	return (
		<div className='relative flex-1'>
			<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
			<input
				type='text'
				placeholder='Поиск...'
				value={searchQuery}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				className='w-full pl-10 pr-24 py-2 border border-input bg-card rounded focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none'
				autoComplete='off'
			/>
			<div className='absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1'>
				{searchQuery && (
					<button
						type='button'
						onClick={handleClear}
						className='p-1 text-muted-foreground hover:text-text-soft cursor-pointer duration-300'
						title='Очистить поле поиска'
					>
						<X className='w-4 h-4' />
					</button>
				)}
				<button
					type='button'
					onClick={handleSearchClick}
					className='px-3 py-1 bg-brand text-white rounded hover:bg-brand-hover text-sm cursor-pointer duration-300'
				>
					Найти
				</button>
			</div>
		</div>
	)
}
