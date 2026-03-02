import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { CONFIG } from '../../../../config/config'

const NewProducts = async () => {
	try {
		const { items } = await fetchProductsByTag('new', {
			limitItems: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
		})

		return (
			<ProductsSections
				title='Новинки'
				viewAllLink={{ text: 'Все новинки', href: 'new' }}
				products={items}
			/>
		)
	} catch (error) {
		return (
			<ErrorComponent
				error={
					error instanceof Error ? error : new Error(String(error))
				}
				userMessage='Не удалось загрузить новинки'
			/>
		)
	}
}

export default NewProducts
