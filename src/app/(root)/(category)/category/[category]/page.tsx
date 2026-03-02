import fetchProductsByCategory from '@/app/(root)/(category)/category/fetchCategory'
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
		}" магазина "Фудмаркет"`,
	}
}

const CategoryPage = async ({
	params,
	searchParams,
}: {
	params: Promise<{ category: string }>
	searchParams: Promise<{ page?: string; itemsPerPage?: string }>
}) => {
	const { category } = await params

	return (
		<Suspense fallback={<Loader />}>
			<GenericListPage
				searchParams={searchParams}
				props={{
					fetchData: ({ pagination: { startIdx, perPage } }) =>
						fetchProductsByCategory(category, {
							pagination: { startIdx, perPage },
						}),
					pageTitle: TRANSLATIONS[category] || category,
					basePath: `/category/${category}`,
					contentType: 'category',
				}}
			/>
		</Suspense>
	)
}

export default CategoryPage
