import { Loader } from '@/components/features/common/loader'
import { Search } from 'lucide-react'

interface SearchStatesProps {
	hasSearched: boolean
	loading: boolean
	searchTerm: string
}

const SearchStates = ({ hasSearched, loading }: SearchStatesProps) => {
	if (!hasSearched && !loading) {
		return (
			<div className='text-center py-12'>
				<Search size={48} className='mx-auto mb-4 text-[#bfbfbf]' />
				<p className='text-lg'>Введите запрос для поиска товаров</p>
				<p className='text-sm'>
					Найдите товары по названию или артикулу
				</p>
			</div>
		)
	}

	if (loading) {
		return (
			<div className='text-center py-12'>
				<Loader />
				<p className='mt-2'>Поиск товаров...</p>
			</div>
		)
	}

	return null
}

export default SearchStates
