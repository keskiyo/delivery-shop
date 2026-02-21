import fetchPurchases from '@/app/(root)/(user)/fetchPurchases'
import ProductsSections from '@/components/shared/ProductsSections'
// import { getPurchases } from '@/lib/services/purchase.service'

const AllPurchases = async () => {
	try {
		const purchases = await fetchPurchases()

		return (
			<ProductsSections
				title='Все покупки'
				viewAllLink={{ text: 'На главную', href: '/' }}
				products={purchases}
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

export default AllPurchases
