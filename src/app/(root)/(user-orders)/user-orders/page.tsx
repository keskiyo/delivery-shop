'use client'

import UserOrdersList from '@/app/(root)/(user-orders)/user-orders/_components/UserOrdersList'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { Loader } from '@/components/features/common/loader'
import { useAuthStore } from '@/store/authStore'
import { Order } from '@/types/order'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const UserOrdersPage = () => {
	const [orders, setOrders] = useState<Order[]>([])
	const [ordersLoading, setOrdersLoading] = useState(false)
	const [error, setError] = useState<{
		error: Error
		userMessage: string
	} | null>(null)
	const { isAuth, isLoading: authLoading } = useAuthStore()

	useEffect(() => {
		if (authLoading) return

		if (!isAuth) {
			setOrders([])
			setOrdersLoading(false)
			setError(null)
			return
		}

		const fetchOrders = async () => {
			try {
				setOrdersLoading(true)
				setError(null)

				const response = await fetch('/api/orders')
				const data = await response.json()

				if (!response.ok) {
					throw new Error(
						data?.message || 'Ошибка при загрузке заказов',
					)
				}

				if (data.success) {
					setOrders(data.orders || [])
				} else {
					throw new Error(
						data.message || 'Ошибка при загрузке заказов',
					)
				}
			} catch (error) {
				setError({
					error:
						error instanceof Error
							? error
							: new Error('Неизвестная ошибка'),
					userMessage: 'Ошибка получения заказов. Попробуйте снова',
				})
			} finally {
				setOrdersLoading(false)
			}
		}

		fetchOrders()
	}, [isAuth, authLoading])

	const renderContent = () => {
		if (authLoading || ordersLoading) {
			return (
				<div className='flex min-h-90 items-center justify-center'>
					<Loader />
				</div>
			)
		}

		if (!isAuth) {
			return (
				<div className='flex min-h-90 flex-col items-center justify-center py-12 text-center'>
					<div className='mb-4 text-6xl'>🔐</div>

					<h2 className='mb-2 text-2xl font-semibold'>
						Войдите в аккаунт
					</h2>

					<p className='mb-6 max-w-md'>
						Чтобы посмотреть свои заказы, нужно авторизоваться.
					</p>

					<Link
						href='/login'
						className='rounded bg-promo px-6 py-3 text-white transition-custom hover:bg-promo-hover'
					>
						Войти
					</Link>
				</div>
			)
		}

		if (error) {
			return (
				<ErrorComponent
					error={error.error}
					userMessage={error.userMessage}
				/>
			)
		}

		if (orders.length === 0) {
			return (
				<div className='flex min-h-90 flex-col items-center justify-center py-12 text-center'>
					<div className='mb-4 text-6xl'>📦</div>

					<h2 className='mb-2 text-2xl font-semibold'>
						Заказов пока нет
					</h2>

					<p className='max-w-md'>
						Здесь будут отображаться ваши заказы, когда Вы сделаете
						покупки в нашем магазине.
					</p>
				</div>
			)
		}

		return <UserOrdersList orders={orders} />
	}

	return (
		<div className='mx-auto px-[max(12px,calc((100%-1208px)/2))] py-8'>
			<h1 className='mb-6 flex flex-row text-4xl font-bold md:mb-8 md:text-5xl xl:mb-10 xl:text-[64px]'>
				Заказы
			</h1>

			{renderContent()}
		</div>
	)
}

export default UserOrdersPage
