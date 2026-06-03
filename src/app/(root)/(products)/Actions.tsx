import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { CONFIG } from '../../../../config/config'

interface ActionProps {
	limitItems?: number
	mobileItemsLimit?: number
	randomize?: boolean
}


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
