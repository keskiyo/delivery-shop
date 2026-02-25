import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import ProductsSections from '@/app/(root)/(products)/ProductsSections'
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
	} catch {
		return (
			<div className='text-red-500'>
				Ошибка: Не удалось загрузить новинки
			</div>
		)
	}
}

export default NewProducts
