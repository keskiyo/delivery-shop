import Container from '@/components/ui/container'
import { Menu, Package, ShoppingCart } from 'lucide-react'

export function Footer({ className }: { className?: string }) {
	return (
		<footer className={`bg-[#242525] shadow-sm ${className}`}>
			<Container>
				<nav className='flex flex-col md:flex-row items-center justify-between py-4 md:h-20 gap-4 md:gap-0'>
					<div className='flex items-center space-x-2 md:space-x-6'>
						<button
							className='md:hidden p-2 text-gray-400 hover:text-gray-100 transition-colors'
							aria-label='Меню'
						>
							<Menu size={20} />
						</button>
						<div className='hidden md:flex space-x-6'>
							<a
								href='#'
								className='text-gray-400 hover:text-gray-100 transition-colors text-sm'
							>
								Каталог
							</a>
							<a
								href='#'
								className='text-gray-400 hover:text-gray-100 transition-colors text-sm'
							>
								О нас
							</a>
							<a
								href='#'
								className='text-gray-400 hover:text-gray-100 transition-colors text-sm'
							>
								Контакты
							</a>
						</div>
					</div>
					<div className='flex items-center space-x-4 md:space-x-6'>
						<button
							className='flex items-center gap-1 text-gray-400 hover:text-gray-100 transition-colors text-sm'
							aria-label='Корзина'
						>
							<ShoppingCart size={18} />
							<span className='md:hidden'>Корзина</span>
						</button>
						<button
							className='flex items-center gap-1 text-gray-400 hover:text-gray-100 transition-colors text-sm'
							aria-label='Заказы'
						>
							<Package size={18} />
							<span className='md:hidden'>Заказы</span>
						</button>
					</div>
				</nav>
			</Container>
		</footer>
	)
}
