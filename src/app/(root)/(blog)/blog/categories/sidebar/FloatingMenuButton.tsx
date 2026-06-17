import { Menu } from 'lucide-react'
import { FloatingMenuButtonProps } from '../types/sidebar.types'

export default function FloatingMenuButton({
	onClick,
	categoriesCount,
}: FloatingMenuButtonProps) {
	return (
		<button
			onClick={onClick}
			className='group fixed bottom-6 right-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-brand text-white shadow-button-default transition-custom hover:scale-105 hover:bg-brand-hover active:scale-95'
			aria-label='Открыть меню категорий'
		>
			<Menu className='h-6 w-6 transition-transform group-hover:rotate-90' />
			<span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-white'>
				{categoriesCount}
			</span>
		</button>
	)
}
