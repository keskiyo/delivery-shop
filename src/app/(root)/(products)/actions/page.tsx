import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import GenericListPage from '@/components/shared/GenericListPage'

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
		<GenericListPage
			searchParams={searchParams}
			props={{
				fetchData: ({ pagination: { startIdx, perPage } }) =>
					fetchProductsByTag('actions', {
						pagination: { startIdx, perPage },
					}),
				pageTitle: 'Все акции',
				basePath: '/actions',
				errorMessage: 'Не удалось загрузить акции',
			}}
		/>
	)
}

export default AllActions
