import { Order, OrderItem } from '@/types/order'
import { ProductCardProps } from '@/types/product'
import { useEffect, useState } from 'react'

/**
 * Хук для обработки товаров из заказа пользователя
 * 
 * Основная задача - преобразовать данные заказа в формат для отображения карточек товаров
 * и проверить актуальное наличие товаров на складе.
 * 
 * Функционал:
 * - Преобразует товары заказа в формат ProductCardProps
 * - Сравнивает количество в заказе с количеством на складе
 * - Формирует предупреждения о проблемах с наличием (нет на складе, мало осталось)
 * 
 * @param order - Объект заказа из истории
 * @param productsData - Текущие данные о товарах (опционально)
 * 
 * @returns Объект с:
 * - orderProducts: массив товаров для отображения
 * - stockWarnings: массив предупреждений о наличии товаров
 */
export const useOrderProducts = (
	order: Order,
	productsData?: ProductCardProps[],
) => {
	const [orderProducts, setOrderProducts] = useState<ProductCardProps[]>([])
	const [stockWarnings, setStockWarnings] = useState<string[]>([])

	useEffect(() => {
		const processProducts = () => {
			try {
				const warnings: string[] = []

				if (productsData && productsData.length > 0) {
					const processedProducts = order.items.map(
						(item: OrderItem, index) => {
							const productData = productsData[index]

							if (!productData) return null

							const availableQuantity = productData.quantity
							const orderQuantity = item.quantity
							const isLowStock = availableQuantity < orderQuantity
							const insufficientStock = availableQuantity === 0

							if (isLowStock) {
								if (insufficientStock) {
									warnings.push(
										`Товар "${productData.title}" временно отсутствует на складе`,
									)
								} else {
									warnings.push(
										`Товара "${productData.title}" осталось ${availableQuantity} шт., а в заказе ${orderQuantity} шт.`,
									)
								}
							}

							const productCardData = {
								_id: productData._id,
								id: productData.id,
								img: productData.img,
								title: productData.title,
								description: productData.description,
								basePrice: item.price,
								orderQuantity: orderQuantity,
								rating: productData.rating,
								quantity: productData.quantity,
								isLowStock,
								insufficientStock,
								categories: productData.categories || [],
							} as ProductCardProps

							return productCardData
						},
					)

					const validProducts = processedProducts.filter(
						(product): product is ProductCardProps =>
							product !== null,
					)

					setOrderProducts(validProducts)
					setStockWarnings(warnings)
				}
			} catch (error) {
				console.error('Ошибка загрузки товаров:', error)
			}
		}

		processProducts()
	}, [order, productsData])

	return { orderProducts, stockWarnings }
}
