'use client'

import IconBox from '@/components/svg/IconBox'
import IconCart from '@/components/svg/iconCart'
import IconHeart from '@/components/svg/IconHeart'
import IconMenuMob from '@/components/svg/IconMenuMob'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const TopMenu = () => {
	const pathname = usePathname()
	const isCatalogPage = pathname === '/catalog'
	const isFavoritesPage = pathname === '/favorites'
	const isCartPage = pathname === '/cart'
	const isUserOrdersPage = pathname === '/user-orders'
	const isAdminOrdersPage = pathname === '/administrator/admin-orders'

	const { user } = useAuthStore()
	const { totalItems, fetchCart } = useCartStore()

	const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin'
	const ordersLink = isManagerOrAdmin
		? '/administrator/admin-orders'
		: '/user-orders'
	const isOrderPage = isUserOrdersPage || isAdminOrdersPage

	useEffect(() => {
		if (user && !isManagerOrAdmin) {
			fetchCart()
		}
	}, [user, isManagerOrAdmin, fetchCart])

	return (
		<ul className='flex flex-row items-end gap-x-5 sm:gap-x-6'>
			<li>
				<Link
					href='/catalog'
					className='flex w-12 flex-col items-center gap-1.5 rounded px-1 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 lg:hidden'
				>
					<IconMenuMob isCatalogPage={isCatalogPage} />
					<span
						className={
							isCatalogPage
								? 'text-promo'
								: 'text-site-chrome-muted'
						}
					>
						Каталог
					</span>
				</Link>
			</li>

			{!isManagerOrAdmin && (
				<li>
					<Link
						href='/favorites'
						className='flex w-12 flex-col items-center gap-1.5 rounded px-1 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
					>
						<IconHeart
							isActive={isFavoritesPage}
							variant='orange'
						/>
						<span
							className={
								isFavoritesPage
									? 'text-promo'
									: 'text-site-chrome-muted'
							}
						>
							Избранное
						</span>
					</Link>
				</li>
			)}

			<li>
				<Link
					href={ordersLink}
					className='flex w-12 flex-col items-center gap-1.5 rounded px-1 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
				>
					<IconBox isActive={isOrderPage} />
					<span
						className={
							isOrderPage
								? 'text-promo'
								: 'text-site-chrome-muted'
						}
					>
						Заказы
					</span>
				</Link>
			</li>

			{!isManagerOrAdmin && (
				<li className='relative'>
					<Link
						href='/cart'
						className='flex w-12 flex-col items-center gap-1.5 rounded px-1 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
					>
						<IconCart isActive={isCartPage} />

						{totalItems > 0 && (
							<span className='absolute -top-2 right-0 bg-promo text-white text-[9px] rounded w-4 h-4 flex items-center justify-center py-0.5 px-1'>
								{totalItems > 99 ? '99+' : totalItems}
							</span>
						)}

						<span
							className={
								isCartPage
									? 'text-promo'
									: 'text-site-chrome-muted'
							}
						>
							Корзина
						</span>
					</Link>
				</li>
			)}
		</ul>
	)
}

export default TopMenu
