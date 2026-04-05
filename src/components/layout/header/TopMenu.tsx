'use client'

import IconMenuMob from '@/components/svg/IconMenuMob'
import { useAuthStore } from '@/store/authStore'
import { Heart, Package, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TopMenu = () => {
	const pathname = usePathname()
	const isCatalogPage = pathname === '/catalog'
	const { user } = useAuthStore()

	const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin'

	return (
		<ul className='flex flex-row gap-x-6 items-end'>
			<Link href='/catalog'>
				<li className='flex flex-col items-center gap-2.5 md:hidden w-11 cursor-pointer'>
					<IconMenuMob isCatalogPage={isCatalogPage} />
					<span
						className={
							isCatalogPage ? 'text-[#ff6633]' : 'text-[#808080]'
						}
					>
						Каталог
					</span>
				</li>
			</Link>

			{!isManagerOrAdmin && (
				<li className='group flex flex-col items-center gap-2 w-11 cursor-pointer'>
					<Heart size={24} className=' group-hover:text-red-400' />
					<span>Избранное</span>
				</li>
			)}

			<li className='group flex flex-col items-center gap-2 w-11 cursor-pointer'>
				<Package
					size={24}
					className={`${
						!isManagerOrAdmin
							? 'group-hover:text-blue-400'
							: 'group-hover:text-orange-600'
					}`}
				/>
				<span>Заказы</span>
			</li>

			{!isManagerOrAdmin && (
				<li className='group flex flex-col items-center gap-2 w-11 cursor-pointer'>
					<ShoppingCart
						size={24}
						className=' group-hover:text-green-400'
					/>
					<span>Корзина</span>
				</li>
			)}
		</ul>
	)
}

export default TopMenu
