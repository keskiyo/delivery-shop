'use client'

/**
 * Верхнее меню навигации в header (иконки + названия)
 * 
 * Ссылки:
 * - Каталог (мобильная версия) - /catalog
 * - Избранное (только для обычных пользователей) - /favorites
 * - Заказы (обычные: /user-orders, админ/менеджер: /administrator/admin-orders)
 * - Корзина (только для обычных пользователей) - /cart
 * 
 * Функционал:
 * - Подсветка активной страницы (оранжевый цвет)
 * - Бейдж с количеством товаров на корзине (показывает 99+ если >99)
 * - Скрытие избранного и корзины для admin/manager
 * 
 * Используется в:
 * - components/layout/header/UserBlock.tsx
 */
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
		<ul className='flex flex-row gap-x-6 items-end'>
			<li>
				<Link
					href='/catalog'
					className='flex flex-col items-center gap-2 md:hidden w-11'
				>
					<IconMenuMob isCatalogPage={isCatalogPage} />
					<span
						className={
							isCatalogPage ? 'text-[#ff6633]' : 'text-[#808080]'
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
						className='flex flex-col items-center gap-2 w-11'
					>
						<IconHeart
							isActive={isFavoritesPage}
							variant='orange'
						/>
						<span
							className={
								isFavoritesPage
									? 'text-[#ff6633]'
									: 'text-[#808080]'
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
					className='flex flex-col items-center w-11'
				>
					<IconBox isActive={isOrderPage} />
					<span
						className={
							isOrderPage ? 'text-[#ff6633]' : 'text-[#808080]'
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
						className='flex flex-col items-center gap-2 w-11'
					>
						<IconCart isActive={isCartPage} />

						{totalItems > 0 && (
							<span className='absolute -top-2 right-0 bg-[#ff6633] text-white text-[9px] rounded w-4 h-4 flex items-center justify-center py-0.5 px-1'>
								{totalItems > 99 ? '99+' : totalItems}
							</span>
						)}

						<span
							className={
								isCartPage ? 'text-[#ff6633]' : 'text-[#808080]'
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
