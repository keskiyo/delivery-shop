import DropFilter from '@/app/(root)/(catalog)/catalog/[category]/_components/DropFilter'
import FilterButtons from '@/app/(root)/(catalog)/catalog/[category]/_components/FilterButtons'
import FilterControls from '@/app/(root)/(catalog)/catalog/[category]/_components/FilterControls'
import PriceFilter from '@/app/(root)/(catalog)/catalog/[category]/_components/PriceFilter'
import fetchProductsByCategory from '@/app/(root)/(catalog)/catalog/[category]/fetchCategory'
import { Loader } from '@/components/features/common/loader'
import GenericListPage from '@/components/shared/GenericListPage'
import { Suspense } from 'react'
import { TRANSLATIONS } from '../../../../../../utils/translations'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ category: string }>
}) {
	const { category } = await params
	return {
		title: TRANSLATIONS[category] || category,
		description: `Описание категории товаров "${
			TRANSLATIONS[category] || category
		}"магазина "Фудмаркет"`,
	}
}

const CategoryPage = async ({
	params,
	searchParams,
}: {
	params: Promise<{ category: string }>
	searchParams: Promise<{
		page?: string
		itemsPerPage?: string
		filter?: string | string[]
		priceFrom?: string
		priceTo?: string
		inStock?: string
	}>
}) => {
	const { category } = await params
	const resolveSearchParams = await searchParams
	const activeFilter = resolveSearchParams.filter
	const priceFrom = resolveSearchParams.priceFrom
	const priceTo = resolveSearchParams.priceTo
	const inStock = resolveSearchParams.inStock === 'true'

	return (
		<div className='px-[max(12px,calc((100%-1208px)/2))] flex flex-col mx-auto'>
			<h1 className='ml-3 xl:ml-0 text-4xl xl:text-5xl text-left font-bolt mb-8 mb:mb-10 xl:mb-15 max-w-84 md:max-w-max leading-[150%]'>
				{TRANSLATIONS[category] || category}
			</h1>
			<DropFilter basePath={`/catalog/${category}`} category={category} />
			<div className='hidden xl:flex'>
				<FilterButtons basePath={`/catalog/${category}`} />
			</div>
			<div className='mt-6 flex flex-col xl:flex-row gap-x-10'>
				<div className='hidden xl:flex flex-col w-68 gap-y-10 '>
					<div className='h-11 rounded text-base font-bold flex items-center p-2'>
						Фильтр
					</div>
					<PriceFilter
						basePath={`/catalog/${category}`}
						category={category}
					/>
				</div>
				<div className='flex flex-col'>
					<div className='hidden xl:flex'>
						<FilterControls basePath={`/catalog/${category}`} />
					</div>
					<Suspense fallback={<Loader />}>
						<GenericListPage
							searchParams={Promise.resolve(resolveSearchParams)}
							props={{
								fetchData: ({
									pagination: { startIdx, perPage },
								}) =>
									fetchProductsByCategory(category, {
										pagination: { startIdx, perPage },
										filter: activeFilter,
										priceFrom,
										priceTo,
										inStock,
									}),
								basePath: `/catalog/${category}`,
								contentType: 'category',
							}}
						/>
					</Suspense>
				</div>
			</div>
		</div>
	)
}

export default CategoryPage
