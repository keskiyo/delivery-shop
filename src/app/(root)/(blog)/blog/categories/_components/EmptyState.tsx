import { FolderX } from 'lucide-react'

export default function EmptyState() {
	return (
		<div className='text-center py-16 bg-card rounded shadow-xl'>
			<div className='w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center'>
				<FolderX className='w-12 h-12' strokeWidth={1.5} />
			</div>
			<h2 className='text-2xl font-semibold mb-2'>
				Категории не найдены
			</h2>
			<p className='text-muted-foreground'>
				Пока нет доступных категорий для отображения
			</p>
		</div>
	)
}
