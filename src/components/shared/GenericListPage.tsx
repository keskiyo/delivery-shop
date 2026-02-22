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
		const items = await props.fetchData()
		const paginatedItems = items.slice(startIdx, startIdx + perPage)
		return (
			<>
				{!props.contentType ? (
					<ProductsSections
						title={props.pageTitle}
						products={paginatedItems as ProductCardProps[]}
					/>
				) : (
					<ArticleSection
						title={props.pageTitle}
						articles={paginatedItems as ArticlesProps[]}
					/>
				)}

				{items.length > perPage && (
					<PaginationWrapper
						totalItems={items.length}
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
