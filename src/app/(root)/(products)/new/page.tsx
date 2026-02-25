import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import GenericListPage from '@/components/shared/GenericListPage'

export const metadata = {
	title: 'Новинки магазина "Фудмаркет"',
	description: 'Новые товары магазина "Фудмаркет"',
}

const AllNew = async ({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; itemsPerPage?: string }>
}) => {
	return (
		<GenericListPage
			searchParams={searchParams}
			props={{
				fetchData: ({ pagination: { startIdx, perPage } }) =>
					fetchProductsByTag('new', {
						pagination: { startIdx, perPage },
					}),
				pageTitle: ' Все новинки',
				basePath: '/new',
				errorMessage: 'Ошибка: не удалось загрузить новинки',
			}}
		/>
	)
}
export default AllNew
