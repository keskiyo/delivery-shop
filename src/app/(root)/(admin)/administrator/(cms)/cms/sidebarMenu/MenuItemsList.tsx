import { MenuItemsListProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/types/sidebar'
import { IconArrowAnim } from './IconArrowAnim'

export const MenuItemsList = ({ items, onItemClick }: MenuItemsListProps) => {
	return (
		<div className='space-y-5 flex-1'>
			{items.map((item, index) => (
				<button
					key={item.id}
					onClick={() => onItemClick(item.path)}
					className={`group w-full flex items-center gap-4 p-5 rounded-xl border border-border bg-card text-left cursor-pointer  transition-custom hover:bg-surface-hover active:bg-surface-pressed hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-3 focus:ring-brand/20 ${item.shadow} animate-slideIn`}
					style={{
						animationDelay: `${index * 100}ms`,
						animationFillMode: 'both',
					}}
				>
					<div
						className={`relative p-3 rounded-lg bg-surface-subtle text-foreground  transition-custom group-hover:bg-brand-soft group-hover:text-brand ${item.shadow}`}
					>
						<div className='relative transition-transform transition-custom group-hover:scale-105'>
							{item.icon}
						</div>
					</div>

					<div className='flex-1'>
						<div className='font-semibold text-base text-foreground transition-colors transition-custom'>
							{item.title}
						</div>
						<div className='text-sm text-muted-foreground mt-1 transition-colors transition-custom'>
							{item.description}
						</div>
					</div>

					<IconArrowAnim />
				</button>
			))}
		</div>
	)
}
