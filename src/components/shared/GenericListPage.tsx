import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import ErrorComponent from '@/components/features/common/ErrorComponent'
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

	const defaultPage =
		props.contentType === 'category'
			? CONFIG.ITEMS_PER_PAGE_CATEGORY
			: CONFIG.ITEMS_PER_PAGE

	const itemsPerPage = params?.itemsPerPage || defaultPage

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
				{!props.contentType || props.contentType === 'category' ? (
					<ProductsSections
						title={props.pageTitle}
						products={items as ProductCardProps[]}
						applyIndexStyles={
							props.contentType === 'category' ? false : true
						}
						contentType={props.contentType}
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
	} catch (error) {
		return (
			<ErrorComponent
				error={
					error instanceof Error ? error : new Error(String(error))
				}
				userMessage='Не удалось загрузить данные'
			/>
		)
	}
}

export default GenericListPage
