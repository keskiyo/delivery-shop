import ProductsSections from '@/app/(root)/(products)/ProductsSections'
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
	} catch {
		return (
			<div className='text-red-500'>
				Ошибка: Не удалось загрузить прошлые покупки
			</div>
		)
	}
}

export default Purchases
