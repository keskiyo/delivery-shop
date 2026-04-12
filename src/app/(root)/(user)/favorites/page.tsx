import { Loader } from '@/components/features/common/loader'
import DropFilter from '@/components/shared/filterComponents/DropFilter'
import FilterButtons from '@/components/shared/filterComponents/FilterButtons'
import FilterControls from '@/components/shared/filterComponents/FilterControls'
import PriceFilter from '@/components/shared/filterComponents/PriceFilter'
import GenericListPage from '@/components/shared/GenericListPage'
import { Suspense } from 'react'
import { getServerUserId } from '../../../../../utils/getServerUserId'
import { TRANSLATIONS } from '../../../../../utils/translations'
import fetchFavorites from './fetchFavorites'

const FavoritesPage = async ({
	searchParams,
}: {
	searchParams: Promise<{
		page?: string
		itemsPerPage?: string
		filter?: string | string[]
		priceFrom?: string
		priceTo?: string
		inStock?: string
	}>
	params: Promise<{ category: string }>
}) => {
	const category = 'favorites'
	const resolvedSearchParams = await searchParams
	const activeFilter = resolvedSearchParams.filter
	const priceFrom = resolvedSearchParams.priceFrom
	const priceTo = resolvedSearchParams.priceTo
	const inStock = resolvedSearchParams.inStock === 'true'

	const userId = await getServerUserId()

	return (
		<div className='px-[max(12px,calc((100%-1208px)/2))] flex flex-col mx-auto'>
			<h1 className='ml-3 xl:ml-0 text-4xl md:text-5xl xl:text-6xl text-left font-bold mb-8 md:mb-10 xl:mb-15 max-w-84 md:max-w-max leading-[150%]'>
				{TRANSLATIONS[category] || category}
			</h1>
			<DropFilter
				basePath={`/${category}`}
				category={category}
				userId={userId}
				apiEndpoint='/users/favorites/products'
			/>
			<div className='hidden xl:flex'>
				<FilterButtons basePath={`/${category}`} />
			</div>
			<div className='mt-6 flex flex-col xl:flex-row gap-x-10'>
				<div className='hidden xl:flex flex-col w-68 gap-y-10 '>
					<div className='h-11 rounded text-2xl font-bold flex items-center p-2'>
						Фильтр
					</div>
					<PriceFilter
						basePath={`/${category}`}
						category={category}
						userId={userId}
						apiEndpoint='/users/favorites/products'
					/>
				</div>
				<div className='flex flex-col'>
					<div className='hidden xl:flex'>
						<FilterControls basePath={`/${category}`} />
					</div>

					<Suspense fallback={<Loader />}>
						<GenericListPage
							searchParams={Promise.resolve(resolvedSearchParams)}
							props={{
								fetchData: ({
									pagination: { startIdx, perPage },
								}) =>
									fetchFavorites({
										pagination: { startIdx, perPage },
										filter: activeFilter,
										priceFrom,
										priceTo,
										inStock,
										userId,
									}),
								basePath: `/${category}`,
								contentType: 'category',
							}}
						/>
					</Suspense>
				</div>
			</div>
		</div>
	)
}

export default FavoritesPage
