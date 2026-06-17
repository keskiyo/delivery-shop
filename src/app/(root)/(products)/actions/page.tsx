import fetchProductsByTag from '@/app/(root)/(products)/fetchProducts'
import { Loader } from '@/components/features/common/loader'
import GenericListPage from '@/components/shared/GenericListPage'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { baseUrl } from '../../../../../utils/baseUrl'

export const metadata: Metadata = {
	title: 'Акции магазина "Фудмаркета"',
	description: 'Акционные товары магазина "Фудмаркета"',
	openGraph: {
		title: 'Акции магазина "Фудмаркета"',
		description: 'Акционные товары магазина "Фудмаркета"',
		url: `${baseUrl}/actions`,
		images: {
			url: `${baseUrl}/og-images/actions-og.jpg`,
			alt: 'Акции магазина "Фудмаркета"',
			width: 512,
			height: 512,
		},
	},
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
