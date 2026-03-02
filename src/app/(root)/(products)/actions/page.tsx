import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import { Loader } from '@/components/features/common/loader'
import GenericListPage from '@/components/shared/GenericListPage'
import { Suspense } from 'react'

export const metadata = {
	title: 'Акции магазина "Фудмаркет"',
	description: 'Акционные товары магазина "Фудмаркет"',
}

const AllActions = async ({
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
						fetchProductsByTag('actions', {
							pagination: { startIdx, perPage },
						}),
					pageTitle: 'Все акции',
					basePath: '/actions',
				}}
			/>
		</Suspense>
	)
}

export default AllActions
