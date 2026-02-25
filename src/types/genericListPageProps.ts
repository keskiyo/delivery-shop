import { ArticlesProps } from '@/types/articles'
import { ProductCardProps } from '@/types/product'

type ContentItem = ProductCardProps | ArticlesProps

interface PaginatedResponse {
	items: ContentItem[]
	totalCount: number
}

export interface GenericListPageProps {
	fetchData: (options: {
		pagination: { startIdx: number; perPage: number }
	}) => Promise<PaginatedResponse>
	pageTitle: string
	basePath: string
	errorMessage: string
	contentType?: 'articles'
}
