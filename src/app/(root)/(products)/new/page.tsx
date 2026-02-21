import fetchProductsByCategory from '@/app/(root)/(products)/fetchProducts'
import GenericListPage from '@/app/(root)/(products)/GenericListPage'

export const metadata = {
	title: 'Новинка магазина "Фудмаркет"',
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
				fetchData: () => fetchProductsByCategory('new'),
				pageTitle: ' Все новинки',
				basePath: '/new',
				errorMessage: 'Ошибка: не удалось загрузить новинки',
			}}
		/>
	)
}
export default AllNew
