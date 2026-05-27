import { MenuHeaderProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/types/sidebar'
import { X } from 'lucide-react'

export const MenuHeader = ({ onCloseAction, icon }: MenuHeaderProps) => {
	return (
		<div className='flex justify-between items-center mb-10'>
			<div className='flex items-center gap-5'>
				<div className='relative rounded-xl bg-brand-soft p-3'>
					{icon}
				</div>
				<h2 className='text-xl font-semibold text-foreground'>
					Быстрые действия
				</h2>
			</div>

			<button
				onClick={onCloseAction}
				className='group p-3 rounded-xl bg-surface-hover text-muted-foreground shadow-lg hover:shadow-xl hover:bg-surface-pressed hover:text-foreground duration-300 cursor-pointer transition-all hover:scale-105 focus:outline-none focus:ring-3 focus:ring-brand/20'
				aria-label='Закрыть меню'
			>
				<X className='w-6 h-6 group-hover:rotate-90 transition-transform duration-300' />
			</button>
		</div>
	)
}
