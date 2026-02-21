import fetchProductsByCategory from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/components/shared/ProductsSections'
import { shuffleArray } from '@/utils/shuffleArray'

const NewProducts = async () => {
	try {
		let products = await fetchProductsByCategory('new')
		products = shuffleArray(products)

		return (
			<ProductsSections
				title='Новинки'
				viewAllLink={{ text: 'Все новинки', href: 'new' }}
				products={products}
				compact
			/>
		)
	} catch {
		return (
			<div className='text-red-500'>
				Ошибка: Не удалось загрузить новинки
			</div>
		)
	}
}

export default NewProducts
