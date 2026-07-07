import { Menu } from 'lucide-react'
import { FloatingMenuButtonProps } from '../types/sidebar.types'

export default function FloatingMenuButton({
	onClick,
	categoriesCount,
}: FloatingMenuButtonProps) {
	return (
		<button
			onClick={onClick}
			className='fixed z-40 flex items-center justify-center text-white rounded-full cursor-pointer group bottom-20 md:bottom-6 right-6 h-14 w-14 bg-brand shadow-button-default transition-custom hover:scale-105 hover:bg-brand-hover active:scale-95'
			aria-label='Открыть меню категорий'
		>
			<Menu className='w-6 h-6 transition-transform group-hover:rotate-90' />
			<span className='absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full -right-1 -top-1 bg-danger'>
				{categoriesCount}
			</span>
		</button>
	)
}
