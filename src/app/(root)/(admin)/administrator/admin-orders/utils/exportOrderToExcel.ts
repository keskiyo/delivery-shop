import {
	downloadOrderExcel,
	generateOrderExcel,
} from '@/app/(root)/(admin)/administrator/admin-orders/utils/excelGenerator'
import { getPaymentStatusText } from '@/app/(root)/(admin)/administrator/admin-orders/utils/getPaymentStatusText'
import { SimplifiedOrderData } from '@/types/excel'
import { Order, OrderItem } from '@/types/order'
import { getMappedStatus } from './getMappedStatus'

interface ProductData {
	title?: string
	name?: string
	weight?: number
	brand?: string
	manufacturer?: string
}

interface EnrichedOrderItem extends Omit<OrderItem, 'name' | 'title'> {
	name: string
	weight: number
	brand: string
	manufacturer: string
	totalPrice: number
}

/**
 * Получает имя товара с приоритетами
 */
const getProductName = (productData?: ProductData): string => {
	return productData?.title || 'Неизвестный товар'
}

/**
 * Загружает данные о продукте
 */
const productCache = new Map<string, ProductData>()

const fetchProductDetails = async (productId: string): Promise<ProductData> => {
	if (productCache.has(productId)) {
		return productCache.get(productId)!
	}

	try {
		const response = await fetch(`/api/products/${productId}`)
		if (!response.ok) throw new Error(`HTTP ${response.status}`)
		const data = await response.json()
		productCache.set(productId, data)
		return data
	} catch (error) {
		console.warn(`Не удалось загрузить товар ${productId}:`, error)
		return {}
	}
}

/**
 * Обогащает данные товара информацией о продукте
 */
const enrichOrderItem = async (item: OrderItem): Promise<EnrichedOrderItem> => {
	const productData = await fetchProductDetails(item.productId)

	return {
		...item,
		name: getProductName(productData),
		weight: productData?.weight || 0,
		brand: productData?.brand || '',
		manufacturer: productData?.manufacturer || '',
		totalPrice: item.price * item.quantity,
	}
}

const prepareExcelData = (
	order: Order,
	items: EnrichedOrderItem[],
): SimplifiedOrderData => ({
	order: {
		orderNumber: order.orderNumber,
		status: getMappedStatus(order),
		createdAt: order.createdAt,
		paymentMethod: order.paymentMethod,
		paymentStatus: getPaymentStatusText(order.paymentStatus),
		totalAmount: order.totalAmount,
		discountAmount: order.discountAmount,
		usedBonuses: order.usedBonuses,
		earnedBonuses: order.earnedBonuses,
		name: order.name,
		surname: order.surname,
		phone: order.phone,
		gender: order.gender,
		birthday: order.birthday,
		deliveryAddress: order.deliveryAddress,
		deliveryDate: order.deliveryDate,
		deliveryTimeSlot: order.deliveryTimeSlot,
	},
	items: items.map(item => ({
		productId: item.productId,
		name: item.name,
		quantity: item.quantity,
		price: item.price,
		totalPrice: item.totalPrice || item.price * item.quantity,
		weight: item.weight,
		brand: item.brand,
		manufacturer: item.manufacturer,
	})),
})

/**
 * Экспорт заказа в Excel
 */
export const exportOrderToExcel = async (order: Order): Promise<void> => {
	try {
		const enrichedItems = await Promise.all(
			order.items.map(enrichOrderItem),
		)
		const excelData = prepareExcelData(order, enrichedItems)

		const excelBuffer = await generateOrderExcel(excelData)
		await downloadOrderExcel(excelBuffer, `Заказ_${order.orderNumber}`)
	} catch (error) {
		console.error('Ошибка экспорта в Excel:', error)
		throw new Error('Не удалось экспортировать заказ')
	}
}
