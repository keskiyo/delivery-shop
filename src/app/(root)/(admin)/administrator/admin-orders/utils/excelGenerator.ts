import { SimplifiedOrderData } from '@/types/excel'
import ExcelJS from 'exceljs'

const toArrayBuffer = (buffer: Buffer | ArrayBuffer): ArrayBuffer => {
	if (buffer instanceof ArrayBuffer) {
		return buffer
	}

	// Проверяем, является ли это Node.js Buffer
	if (typeof Buffer !== 'undefined' && Buffer.isBuffer(buffer)) {
		// Создаём новый ArrayBuffer и копируем данные
		const arrayBuffer = new ArrayBuffer(buffer.length)
		const view = new Uint8Array(arrayBuffer)
		for (let i = 0; i < buffer.length; i++) {
			view[i] = buffer[i]
		}
		return arrayBuffer
	}

	// Fallback для других случаев
	if ('byteLength' in buffer) {
		return buffer as unknown as ArrayBuffer
	}

	throw new Error('Невозможно преобразовать буфер в ArrayBuffer')
}

export const generateOrderExcel = async (data: SimplifiedOrderData) => {
	const workbook = new ExcelJS.Workbook()
	const { order, items } = data

	// === ЛИСТ 1: ОСНОВНАЯ ИНФОРМАЦИЯ О ЗАКАЗЕ ===
	const formatDate = (dateString: string): string => {
		if (!dateString) return 'Не указано'
		try {
			const date = new Date(dateString)
			return date.toLocaleDateString('ru-RU')
		} catch {
			return dateString
		}
	}

	const formatDateTime = (dateString: string): string => {
		if (!dateString) return 'Не указано'
		try {
			const date = new Date(dateString)
			return date.toLocaleString('ru-RU')
		} catch {
			return dateString
		}
	}

	const orderSummary = [
		['📋 ОСНОВНАЯ ИНФОРМАЦИЯ О ЗАКАЗЕ', ''],
		['Номер заказа', order.orderNumber],
		['Статус заказа', order.status],
		['Дата создания', formatDateTime(order.createdAt)],
		['', ''],
		['💳 ИНФОРМАЦИЯ ОБ ОПЛАТЕ', ''],
		[
			'Способ оплаты',
			order.paymentMethod === 'cash_on_delivery'
				? 'Наложенный платёж'
				: order.paymentMethod,
		],
		['Статус оплаты', order.paymentStatus],
		['Общая сумма', `${order.totalAmount} ₽`],
		[
			'Скидка',
			order.discountAmount > 0 ? `${order.discountAmount} ₽` : 'Нет',
		],
		['Использовано бонусов', order.usedBonuses || 'Нет'],
		['Начислено бонусов', order.earnedBonuses || 'Нет'],
		['', ''],
		['👤 ИНФОРМАЦИЯ О КЛИЕНТЕ', ''],
		['ФИО', `${order.surname || ''} ${order.name}`.trim()],
		['Телефон', order.phone],
		[
			'Пол',
			order.gender === 'male'
				? 'Мужской'
				: order.gender === 'female'
					? 'Женский'
					: 'Не указан',
		],
		[
			'Дата рождения',
			order.birthday ? formatDate(order.birthday) : 'Не указана',
		],
		['', ''],
		['🚚 ИНФОРМАЦИЯ О ДОСТАВКЕ', ''],
		[
			'Адрес доставки',
			[
				order.deliveryAddress?.city,
				order.deliveryAddress?.street,
				order.deliveryAddress?.house,
				order.deliveryAddress?.apartment &&
					`кв. ${order.deliveryAddress.apartment}`,
			]
				.filter(Boolean)
				.join(', ') || 'Не указан',
		],
		[
			'Дата доставки',
			order.deliveryDate ? formatDate(order.deliveryDate) : 'Не указана',
		],
		['Время доставки', order.deliveryTimeSlot || 'Не указано'],
	]

	const orderSheet = workbook.addWorksheet('📋 Заказ')
	orderSheet.addRows(orderSummary)

	// === ЛИСТ 2: ТОВАРЫ В ЗАКАЗЕ ===
	const productsHeader = [
		'№',
		'ID товара',
		'Наименование',
		'Количество',
		'Цена за шт.',
		'Общая стоимость',
		'Вес',
		'Бренд',
		'Производитель',
	]

	const productsData = items.map((item, index) => [
		index + 1,
		item.productId,
		item.name || 'Название не указано',
		item.quantity,
		`${item.price} ₽`,
		`${(item.price * item.quantity).toFixed(2)} ₽`,
		item.weight ? `${item.weight} кг` : 'Не указан',
		item.brand || 'Не указан',
		item.manufacturer || 'Не указан',
	])

	// Подсчет общего веса
	const totalWeight = items.reduce((sum, item) => {
		return sum + (item.weight || 0) * item.quantity
	}, 0)

	const totalRow = [
		'',
		'',
		'',
		'',
		'💰 ИТОГО:',
		`${order.totalAmount} ₽`,
		`Общий вес: ${totalWeight.toFixed(2)} кг`,
		'',
		'',
	]

	const productsSheet = workbook.addWorksheet('📦 Товары')
	productsSheet.addRows([productsHeader, ...productsData, totalRow])

	// === ЛИСТ 3: СВОДКА ПО ЗАКАЗУ ===
	const summaryData = [
		['📊 СВОДКА ПО ЗАКАЗУ', ''],
		['Номер заказа', order.orderNumber],
		['Дата создания', formatDateTime(order.createdAt)],
		['Количество товаров', items.length],
		['Общая сумма заказа', `${order.totalAmount} ₽`],
		['Общий вес заказа', `${totalWeight.toFixed(2)} кг`],
		[
			'Средняя цена товара',
			`${(order.totalAmount / items.reduce((sum, item) => sum + item.quantity, 0)).toFixed(2)} ₽`,
		],
		['', ''],
		['РАСПРЕДЕЛЕНИЕ ПО ТОВАРАМ', ''],
		...items.map((item, index) => [
			`${index + 1}. ${item.name || item.productId}`,
			`${item.quantity} шт × ${item.price} ₽ = ${(item.quantity * item.price).toFixed(2)} ₽`,
		]),
	]

	const summarySheet = workbook.addWorksheet('📊 Сводка')
	summarySheet.addRows(summaryData)

	// Генерация буфера (асинхронная операция)
	return await workbook.xlsx.writeBuffer()
}

// Обертка для совместимости с существующим кодом
export const downloadOrderExcel = async (
	buffer: ArrayBuffer | Buffer,
	fileName: string,
) => {
	try {
		const arrayBuffer = toArrayBuffer(buffer)

		const blob = new Blob([arrayBuffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		})

		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `${fileName.replace(/[^\w\s]/gi, '')}.xlsx`

		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		URL.revokeObjectURL(url) // Освобождаем память
	} catch (error) {
		console.error('Ошибка скачивания Excel:', error)
		throw error
	}
}
