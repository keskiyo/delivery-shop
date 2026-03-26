'use client'

import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { Loader } from '@/components/features/common/loader'
import { useAuthStore } from '@/store/authStore'
import { ProductCardProps } from '@/types/product'
import { useEffect, useState } from 'react'
import { CONFIG } from '../../../../config/config'
import fetchPurchases from './fetchPurchases'

const Purchases = () => {
	const [shouldShow, setShouldShow] = useState(false)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)
	const [items, setItems] = useState<ProductCardProps[]>([])
	const { user, isAuth } = useAuthStore()

	useEffect(() => {
		const checkAccessAndFetchData = async () => {
			try {
				const hasAccess = isAuth && user?.role === 'user'
				setShouldShow(hasAccess)

				if (hasAccess) {
					const { items: purchases } = await fetchPurchases({
						usersPurchasesLimit:
							CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
					})
					setItems(purchases)
				}
			} catch (error) {
				setError(
					error instanceof Error ? error : new Error(String(error)),
				)
			} finally {
				setLoading(false)
			}
		}

		checkAccessAndFetchData()
	}, [isAuth, user])

	if (!shouldShow) return null

	if (loading) return <Loader />

	if (error) {
		return (
			<ErrorComponent
				error={
					error instanceof Error ? error : new Error(String(error))
				}
				userMessage='Не удалось загрузить прошлые покупки'
			/>
		)
	}

	return (
		<ProductsSections
			title='Покупали ранее'
			products={items}
			viewAllLink={{ text: 'Все покупки', href: 'purchases' }}
		/>
	)
}

export default Purchases
