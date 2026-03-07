import DropFilter from '@/app/(root)/(category)/category/DropFilter'
import fetchProductsByCategory from '@/app/(root)/(category)/category/fetchCategory'
import FilterButtons from '@/app/(root)/(category)/category/FilterButtons'
import FilterControls from '@/app/(root)/(category)/category/FilterControls'
import PriceFilter from '@/app/(root)/(category)/category/PriceFilter'
import { Loader } from '@/components/features/common/loader'
import GenericListPage from '@/components/shared/GenericListPage'
import { TRANSLATIONS } from '@/utils/translations'
import { Suspense } from 'react'

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
			<DropFilter
				basePath={`/category/${category}`}
				category={category}
			/>
			<div className='hidden xl:flex'>
				<FilterButtons basePath={`/category/${category}`} />
			</div>
			<div className='mt-6 flex flex-col xl:flex-row gap-x-10'>
				<div className='hidden xl:flex flex-col w-68 gap-y-10 '>
					<div className='h-11 rounded text-base font-bold flex items-center p-2'>
						Фильтр
					</div>
					<PriceFilter
						basePath={`/category/${category}`}
						category={category}
					/>
				</div>
				<div className='flex flex-col'>
					<div className='hidden xl:flex'>
						<FilterControls basePath={`/category/${category}`} />
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
								basePath: `/category/${category}`,
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
