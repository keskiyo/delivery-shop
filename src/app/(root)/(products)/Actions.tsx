import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import { CONFIG } from '../../../../config/config'

const Actions = async () => {
	try {
		const { items } = await fetchProductsByTag('actions', {
			limitItems: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
		})

		return (
			<ProductsSections
				title='Акции'
				viewAllLink={{ text: 'Все акции', href: 'actions' }}
				products={items}
			/>
		)
	} catch {
		return (
			<div className='text-red-500'>
				Ошибка: Не удалось загрузить акции
			</div>
		)
	}
}

export default Actions
