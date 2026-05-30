import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { CONFIG } from '../../../../config/config'

interface ActionProps {
	limitItems?: number
	mobileItemsLimit?: number
	randomize?: boolean
}

/**
 * Серверный компонент для отображения акционных товаров
 *
 * Функционал:
 * - Загружает товары с тегом "actions" из базы данных
 * - Отображает их в виде горизонтальной секции с карточками
 * - Ссылка "Все акции" ведет на страницу /actions
 * - Обработка ошибок загрузки
 *
 * Параметры:
 * - limitItems: количество товаров для загрузки (по умолчанию из CONFIG)
 * - mobileItemsLimit: количество товаров на мобильных (по умолчанию 4)
 * - randomize: случайная выборка товаров, используется только на главной странице
 *
 * Логика работы:
 * 1. Вызывает fetchProductsByTag('actions') для получения акционных товаров
 * 2. Передает товары в ProductsSections для отображения
 * 3. При ошибке показывает ErrorComponent
 *
 * Используется на:
 * - Главная страница (/)
 * - Страница товара (внизу страницы)
 *
 * @param limitItems - Максимальное количество товаров для загрузки
 * @param mobileItemsLimit - Количество товаров на мобильных устройствах
 */
const Actions = async ({
	limitItems = CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
	mobileItemsLimit = 4,
	randomize = false,
}: ActionProps) => {
	let items

	try {
		const data = await fetchProductsByTag('actions', {
			pagination: {
				startIdx: 0,
				perPage: limitItems,
			},
			randomize,
		})

		items = data.items
	} catch (error) {
		return (
			<ErrorComponent
				error={
					error instanceof Error ? error : new Error(String(error))
				}
				userMessage='Не удалось загрузить акции'
			/>
		)
	}

	return (
		<ProductsSections
			title='Акции'
			viewAllLink={{ text: 'Все акции', href: '/actions' }}
			products={items}
			mobileItemsLimit={mobileItemsLimit}
		/>
	)
}

export default Actions
