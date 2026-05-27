import { useCategoryStore } from '@/store/categoryStore'

export const EmptyState = () => {
	const { searchQuery } = useCategoryStore()
	return (
		<div className='p-8 text-center text-muted-foreground'>
			{searchQuery
				? 'Ничего не найдено по Вашему запросу'
				: 'Категорий пока нет'}
		</div>
	)
}
