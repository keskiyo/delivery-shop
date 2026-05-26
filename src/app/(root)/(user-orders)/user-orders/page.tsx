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
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<{
		error: Error
		userMessage: string
	} | null>(null)
	const { isAuth, isLoading: authLoading, checkAuth } = useAuthStore()

	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	useEffect(() => {
		if (authLoading) return

		if (!isAuth) {
			setOrders([])
			setLoading(false)
			setError(null)
			return
		}

		const fetchOrders = async () => {
			try {
				setLoading(true)

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
				setLoading(false)
			}
		}

		fetchOrders()
	}, [isAuth, authLoading])

	if (authLoading || loading) return <Loader />

	if (!isAuth) {
		return (
			<div className='px-[max(12px,calc((100%-1208px)/2))] mx-auto py-8'>
				<h1 className='mb-6 md:mb-8 xl:mb-10 flex flex-row text-4xl md:text-5xl xl:text-[64px] font-bold'>
					Заказы
				</h1>

				<div className='flex flex-col items-center justify-center py-12 text-center'>
					<div className='text-6xl mb-4'>🔐</div>

					<h2 className='text-2xl font-semibold mb-2'>
						Войдите в аккаунт
					</h2>

					<p className='max-w-md mb-6'>
						Чтобы посмотреть свои заказы, нужно авторизоваться.
					</p>

					<Link
						href='/login'
						className='px-6 py-3 rounded bg-promo text-promo-foreground hover:bg-promo-hover duration-300'
					>
						Войти
					</Link>
				</div>
			</div>
		)
	}

	if (error)
		return (
			<ErrorComponent
				error={error.error}
				userMessage={error.userMessage}
			/>
		)

	if (orders.length === 0) {
		return (
			<div className='px-[max(12px,calc((100%-1208px)/2))] mx-auto py-8'>
				<h1 className='mb-6 md:mb-8 xl:mb-10 flex flex-row text-4xl md:text-5xl xl:text-[64px] font-bold'>
					Заказы
				</h1>

				<div className='flex flex-col items-center justify-center py-12 text-center'>
					<div className='text-6xl mb-4'>📦</div>
					<h2 className='text-2xl font-semibold mb-2'>
						Заказов пока нет
					</h2>
					<p className='max-w-md'>
						Здесь будут отображаться ваши заказы, когда Вы сделаете
						покупки в нашем магазине
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className='px-[max(12px,calc((100%-1208px)/2))] mx-auto py-8'>
			<h1 className='mb-6 md:mb-8 xl:mb-10 flex flex-row text-4xl md:text-5xl xl:text-[64px] font-bold'>
				Заказы
			</h1>
			<UserOrdersList orders={orders} />
		</div>
	)
}

export default UserOrdersPage
