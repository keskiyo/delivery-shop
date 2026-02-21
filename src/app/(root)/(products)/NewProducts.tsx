import fetchProductsByCategory from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/components/shared/ProductsSections'

const NewProducts = async () => {
	try {
		const products = await fetchProductsByCategory('new')

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
