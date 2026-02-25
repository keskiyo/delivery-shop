import fetchPurchases from '@/app/(root)/(user)/fetchPurchases'
import GenericListPage from '@/components/shared/GenericListPage'

const AllPurchases = async ({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; itemsPerPage?: string }>
}) => {
	return (
		<GenericListPage
			searchParams={searchParams}
			props={{
				fetchData: ({ pagination: { startIdx, perPage } }) =>
					fetchPurchases({
						pagination: { startIdx, perPage },
					}),
				pageTitle: ' Все покупки',
				basePath: '/purchases',
				errorMessage: 'Ошибка: не удалось загрузить покупки',
			}}
		/>
	)
}

export default AllPurchases
