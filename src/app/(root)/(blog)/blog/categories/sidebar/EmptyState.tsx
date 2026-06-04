import { Search } from 'lucide-react'

export default function EmptyState({
  hasSearchQuery,
}: {
	hasSearchQuery: boolean
}) {
	return (
		<div className='py-12 text-center'>
			<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-subtle'>
				<Search className='h-8 w-8 text-muted-foreground' />
			</div>
			<p className='text-muted-foreground'>
				{hasSearchQuery ? 'Категории не найдены' : 'Нет доступных категорий'}
			</p>
		</div>
	)
}
