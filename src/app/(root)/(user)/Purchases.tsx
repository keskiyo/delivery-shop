import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import fetchPurchases from './fetchPurchases'

const Purchases = async () => {
	try {
		const purchases = await fetchPurchases()

		return (
			<ProductsSections
				title='Покупали ранее'
				products={purchases}
				viewAllLink={{ text: 'Все покупки', href: 'purchases' }}
				compact
			/>
		)
	} catch {
		return (
			<div className='text-red-500'>
				Ошибка: Не удалось загрузить прошлые покупки
			</div>
		)
	}
}

export default Purchases
