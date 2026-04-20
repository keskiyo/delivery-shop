import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import { Loader } from '@/components/features/common/loader'
import GenericListPage from '@/components/shared/GenericListPage'
import { Suspense } from 'react'

export const metadata = {
	title: 'Новинки магазина "Фудмаркет"',
	description: 'Новые товары магазина "Фудмаркет"',
}

/**
 * Страница всех новинок
 * 
 * Отображает список всех товаров с тегом "new"
 * Использует GenericListPage для пагинации и отображения товаров
 * 
 * @route /new
 * @param searchParams - Query параметры (page, itemsPerPage)
 */
const AllNew = async ({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; itemsPerPage?: string }>
}) => {
	return (
		<Suspense fallback={<Loader />}>
			<GenericListPage
				searchParams={searchParams}
				props={{
					fetchData: ({ pagination: { startIdx, perPage } }) =>
						fetchProductsByTag('new', {
							pagination: { startIdx, perPage },
						}),
					pageTitle: ' Все новинки',
					basePath: '/new',
				}}
			/>
		</Suspense>
	)
}
export default AllNew
