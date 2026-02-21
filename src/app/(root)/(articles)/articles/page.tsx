import fetchArticles from '@/app/(root)/(articles)/fetchArticles'
import GenericListPage from '@/app/(root)/(products)/GenericListPage'

export const metadata = {
	title: 'Статьи на сайте магазина "Фудмаркет"',
	description: 'Читайте статьи на сайте магазина "Фудмаркет"',
}

const AllArticles = async ({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; itemsPerPage?: string }>
}) => {
	return (
		<GenericListPage
			searchParams={searchParams}
			props={{
				fetchData: () => fetchArticles(),
				pageTitle: ' Все статьи',
				basePath: '/articles',
				errorMessage: 'Ошибка: не удалось загрузить статьи',
				contentType: 'articles',
			}}
		/>
	)
}

export default AllArticles
