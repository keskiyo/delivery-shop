import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import PaginationWrapper from '@/components/shared/PaginationWrapper'
import { ArticlesProps } from '@/types/articles'
import { GenericListPageProps } from '@/types/genericListPageProps'
import { ProductCardProps } from '@/types/product'
import { CONFIG } from '../../../config/config'
import ArticleSection from '../../app/(root)/(articles)/ArticlesSection'

const GenericListPage = async ({
	searchParams,
	props,
}: {
	searchParams: Promise<{ page?: string; itemsPerPage?: string }>
	props: GenericListPageProps
}) => {
	const params = await searchParams
	const page = params?.page
	const itemsPerPage = params?.itemsPerPage || CONFIG.ITEMS_PER_PAGE

	const currentPage = Number(page) || 1
	const perPage = Number(itemsPerPage)
	const startIdx = (currentPage - 1) * perPage

	try {
		const { items, totalCount } = await props.fetchData({
			pagination: { startIdx, perPage },
		})

		const totalPages = Math.ceil(totalCount / perPage)

		return (
			<>
				{!props.contentType ? (
					<ProductsSections
						title={props.pageTitle}
						products={items as ProductCardProps[]}
					/>
				) : (
					<ArticleSection
						title={props.pageTitle}
						articles={items as ArticlesProps[]}
					/>
				)}

				{totalPages > 1 && (
					<PaginationWrapper
						totalItems={totalCount}
						currentPage={currentPage}
						basePath={props.basePath}
						contentType={props.contentType}
					/>
				)}
			</>
		)
	} catch {
		return <div className='text-red-500'>Ошибка: {props.errorMessage}</div>
	}
}

export default GenericListPage
