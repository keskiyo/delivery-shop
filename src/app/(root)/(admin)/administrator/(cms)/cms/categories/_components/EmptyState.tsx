import { useCategoryStore } from '@/store/categoryStore'

export const EmptyState = () => {
	const { searchQuery } = useCategoryStore()
	return (
		<div className='p-8 text-center text-[#8a8a8a]'>
			{searchQuery
				? 'Ничего не найдено по Вашему запросу'
				: 'Категорий пока нет'}
		</div>
	)
}
