import GenericListPage from '@/app/(root)/(products)/GenericListPage'
import fetchPurchases from '@/app/(root)/(user)/fetchPurchases'

const AllPurchases = async ({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; itemsPerPage?: string }>
}) => {
	return (
		<GenericListPage
			searchParams={searchParams}
			props={{
				fetchData: () => fetchPurchases(),
				pageTitle: ' Все покупки',
				basePath: '/purchases',
				errorMessage: 'Ошибка: не удалось загрузить покупки',
			}}
		/>
	)
}

export default AllPurchases
