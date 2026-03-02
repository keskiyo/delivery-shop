import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { CONFIG } from '../../../../config/config'
import fetchPurchases from './fetchPurchases'

const Purchases = async () => {
	try {
		const { items } = await fetchPurchases({
			usersPurchasesLimit: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
		})

		return (
			<ProductsSections
				title='Покупали ранее'
				products={items}
				viewAllLink={{ text: 'Все покупки', href: 'purchases' }}
			/>
		)
	} catch (error) {
		return (
			<ErrorComponent
				error={
					error instanceof Error ? error : new Error(String(error))
				}
				userMessage='Не удалось загрузить прошлые покупки'
			/>
		)
	}
}

export default Purchases
