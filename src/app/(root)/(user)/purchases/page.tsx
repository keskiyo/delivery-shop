import fetchPurchases from '@/app/(root)/(user)/fetchPurchases'
import { Loader } from '@/components/features/common/loader'
import GenericListPage from '@/components/shared/GenericListPage'
import { Suspense } from 'react'
import { getServerUserId } from '../../../../../utils/getServerUserId'

const AllPurchases = async ({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; itemsPerPage?: string }>
}) => {
	const userId = await getServerUserId()
	return (
		<Suspense fallback={<Loader />}>
			<GenericListPage
				searchParams={searchParams}
				props={{
					fetchData: ({ pagination: { startIdx, perPage } }) =>
						fetchPurchases({
							pagination: { startIdx, perPage },
							userId,
						}),
					pageTitle: ' Все покупки',
					basePath: '/purchases',
				}}
			/>
		</Suspense>
	)
}

export default AllPurchases
