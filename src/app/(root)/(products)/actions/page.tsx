import fetchProductsByCategory from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/components/shared/ProductsSections'
// import { getProductsByCategory } from '@/lib/services/product.service'

export const metadata = {
	title: 'Акции магазина "Фудмаркет"',
	description: 'Акционные товары магазина "Фудмаркет"',
}

const AllActions = async () => {
	try {
		const products = await fetchProductsByCategory('actions')

		return (
			<ProductsSections
				title='Все акции'
				viewAllLink={{ text: 'На главную', href: '/' }}
				products={products}
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

export default AllActions
