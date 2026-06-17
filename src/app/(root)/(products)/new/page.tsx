import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import { Loader } from '@/components/features/common/loader'
import GenericListPage from '@/components/shared/GenericListPage'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { baseUrl } from '../../../../../utils/baseUrl'

export const metadata: Metadata = {
	title: 'Новинки магазина "Фудмаркета"',
	description: 'Новые товары магазина "Фудмаркета"',
	openGraph: {
		title: 'Новинки магазина "Фудмаркета"',
		description: 'Новые товары магазина "Фудмаркета"',
		url: `${baseUrl}/new`,
		images: {
			url: `${baseUrl}/og-images/new-og.jpg`,
			alt: 'Новинки магазина "Фудмаркета"',
			width: 512,
			height: 512,
		},
	},
}

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
