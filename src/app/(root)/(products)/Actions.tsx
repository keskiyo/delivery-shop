import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import ErrorComponent from '@/components/features/common/ErrorComponent'
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
}

export default Actions
