'use client'

import { ThemeToggle } from '@/components/ui/theme/ThemeToggle'
import {
	ChevronDown,
	CircleUserRound,
	Heart,
	Menu,
	Package,
	ShoppingCart,
} from 'lucide-react'

export function UserBlock() {
	return (
		<nav aria-label='Основное меню' className='text-gray-300'>
			{/* Только на mobile — fixed bottom bar */}
			<div className='md:hidden h-14 fixed bottom-0 left-0 right-0 flex flex-row justify-between items-center w-full px-4 py-2 bg-[#242525] shadow-(--shadow-default) z-50 text-[8px] md:text-[12px]'>
				<ul className='flex flex-row gap-x-6 items-end'>
					<li className='flex flex-col items-center gap-2.5 w-11 cursor-pointer'>
						<Menu size={24} />
						<span className='text-[10px] md:text-xs'>Каталог</span>
					</li>
					<li className='flex flex-col items-center gap-2.5 w-11 cursor-pointer'>
						<Heart size={24} />
						<span className='text-[10px] md:text-xs'>
							Избранное
						</span>
					</li>
					<li className='flex flex-col items-center gap-2.5 w-11 cursor-pointer'>
						<Package size={24} />
						<span className='text-[10px] md:text-xs'>Заказы</span>
					</li>
					<li className='flex flex-col items-center gap-2.5 w-11 cursor-pointer'>
						<ShoppingCart size={24} />
						<span className='text-[10px] md:text-xs'>Корзина</span>
					</li>
				</ul>
				<div className='ml-6 p-2 flex items-center gap-2'>
					<CircleUserRound size={40} />
					<p className='hidden xl:block cursor-pointer p-2.5'>
						Максим
					</p>
					<button className='hidden xl:block cursor-pointer p-2'>
						<ChevronDown size={24} />
					</button>
					<ThemeToggle />
				</div>
			</div>

			{/* На desktop — обычный inline-block / flex-item */}
			<div className='hidden md:flex items-center gap-4 lg:gap-6'>
				<ul className='flex flex-row gap-4 items-center'>
					<li className='flex items-center gap-2 cursor-pointer group'>
						<Heart
							size={20}
							className=' group-hover:text-red-400'
						/>
						<span className='text-xs group-hover:text-white'>
							Избранное
						</span>
					</li>
					<li className='flex items-center gap-2 cursor-pointer group'>
						<Package
							size={20}
							className=' group-hover:text-blue-400'
						/>
						<span className='text-xs group-hover:text-white'>
							Заказы
						</span>
					</li>
					<li className='flex items-center gap-2 cursor-pointer group'>
						<ShoppingCart
							size={20}
							className=' group-hover:text-green-400'
						/>
						<span className='text-xs  group-hover:text-white'>
							Корзина
						</span>
					</li>
				</ul>

				<div className='flex items-center gap-2'>
					<CircleUserRound size={28} className='' />
					<p className='hidden xl:block  cursor-pointer px-2'>
						Максим
					</p>
					<button className='hidden xl:block cursor-pointer p-1'>
						<ChevronDown size={20} />
					</button>
					<ThemeToggle />
				</div>
			</div>
		</nav>
	)
}

{
	/* <ChevronUp /> */
}
