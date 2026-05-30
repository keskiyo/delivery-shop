import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { CONFIG } from '../../../../config/config'

interface NewProductsProps {
	randomize?: boolean
}

const NewProducts = async ({ randomize = false }: NewProductsProps) => {
	let items

	try {
		const data = await fetchProductsByTag('new', {
			pagination: {
				startIdx: 0,
				perPage: CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS,
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
				userMessage='Не удалось загрузить новинки'
			/>
		)
	}

	return (
		<ProductsSections
			title='Новинки'
			viewAllLink={{ text: 'Все новинки', href: '/new' }}
			products={items}
		/>
	)
}

export default NewProducts
