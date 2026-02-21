import fetchProductsByCategory from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/components/shared/ProductsSections'
import { shuffleArray } from '@/utils/shuffleArray'

const Actions = async () => {
	try {
		let products = await fetchProductsByCategory('actions')
		products = shuffleArray(products)

		return (
			<ProductsSections
				title='Акции'
				viewAllLink={{ text: 'Все акции', href: 'actions' }}
				products={products}
				compact
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
