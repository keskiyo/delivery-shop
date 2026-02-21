import fetchProductsByCategory from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/components/shared/ProductsSections'
// import { getProductsByCategory } from '@/lib/services/product.service'

export const metadata = {
	title: 'Новинка магазина "Фудмаркет"',
	description: 'Новые товары магазина "Фудмаркет"',
}

const AllNew = async () => {
	try {
		const products = await fetchProductsByCategory('new')

		return (
			<ProductsSections
				title='Все новинки'
				viewAllLink={{ text: 'На главную', href: '/' }}
				products={products}
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

export default AllNew
