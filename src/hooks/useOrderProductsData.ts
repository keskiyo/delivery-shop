import { Order } from '@/types/order'
import { ProductCardProps } from '@/types/product'
import { useEffect, useState } from 'react'

/**
 * Хук для загрузки актуальных данных о товарах из заказа
 * 
 * При просмотре исторического заказа необходимо показать актуальные данные:
 * - Текущие цены (могут отличаться от цен в заказе)
 * - Наличие на складе
 * - Рейтинг товара
 * 
 * Этот хук делает параллельные запросы к API для каждого товара из заказа.
 * 
 * @param order - Объект заказа из истории
 * 
 * @returns Объект с:
 * - productsData: массив данных о товарах
 * - loading: флаг загрузки
 * 
 * @example
 * const { productsData, loading } = useOrderProductsData(order)
 * if (loading) return <Loader />
 * return <OrderProducts products={productsData} />
 */
export const useOrderProductsData = (order: Order) => {
	const [productsData, setProductsData] = useState<ProductCardProps[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchProductsData = async () => {
			const data = await Promise.all(
				order.items.map(async item => {
					const response = await fetch(
						`/api/products/${item.productId}`,
					)
					return response.json()
				}),
			)
			setProductsData(data)
			setLoading(false)
		}

		if (order.items.length > 0) {
			fetchProductsData()
		}
	}, [order.items])

	return { productsData, loading }
}
