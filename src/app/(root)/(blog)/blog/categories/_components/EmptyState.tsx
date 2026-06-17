import { FolderX } from 'lucide-react'

export default function EmptyState() {
	return (
		<div className='rounded-md border border-border bg-card px-6 py-16 text-center shadow-default'>
			<div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-subtle text-muted-foreground'>
				<FolderX className='h-12 w-12' strokeWidth={1.5} />
			</div>
			<h2 className='mb-2 text-2xl font-semibold text-foreground'>
				Категории не найдены
			</h2>
			<p className='text-muted-foreground'>
				Пока нет доступных категорий для отображения
			</p>
		</div>
	)
}
