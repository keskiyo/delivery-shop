import fetchProductsByCategory from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/components/shared/ProductsSections'

const Actions = async () => {
	try {
		const products = await fetchProductsByCategory('actions')

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
