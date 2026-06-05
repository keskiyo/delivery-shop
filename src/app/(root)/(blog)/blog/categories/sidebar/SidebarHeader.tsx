import { Folder, X } from 'lucide-react'
import { SidebarHeaderProps } from '../types/sidebar.types'
import SearchInput from './SearchInput'

export default function SidebarHeader({
	categoriesCount,
	onClose,
	searchQuery,
	onSearchChange,
}: SidebarHeaderProps) {
	return (
		<div className='sticky top-0 z-10 border-b border-border bg-card p-6'>
			<div className='mb-6 flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div className='rounded-md bg-brand p-2 text-white'>
						<Folder className='h-6 w-6' />
					</div>
					<div>
						<h2 className='text-xl font-bold text-foreground'>
							Все категории
						</h2>
						<p className='text-sm text-muted-foreground'>
							{categoriesCount} разделов
						</p>
					</div>
				</div>
				<button
					onClick={onClose}
					className='cursor-pointer rounded-md p-2 text-muted-foreground hover:bg-surface-hover hover:text-foreground'
					aria-label='Закрыть меню'
				>
					<X className='h-5 w-5' />
				</button>
			</div>

			<SearchInput value={searchQuery} onChange={onSearchChange} />
		</div>
	)
}
