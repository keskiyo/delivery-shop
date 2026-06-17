import fetchArticles from '@/app/(root)/(articles)/fetchArticles'
import { Loader } from '@/components/features/common/loader'
import GenericListPage from '@/components/shared/GenericListPage'
import { Suspense } from 'react'

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
		<Suspense fallback={<Loader />}>
			<GenericListPage
				searchParams={searchParams}
				props={{
					fetchData: ({ pagination: { startIdx, perPage } }) =>
						fetchArticles({
							pagination: { startIdx, perPage },
						}),
					pageTitle: ' Все статьи',
					basePath: '/articles',
					contentType: 'articles',
				}}
			/>
		</Suspense>
	)
}

export default AllArticles
