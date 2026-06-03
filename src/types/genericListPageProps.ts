import { ArticleCardProps } from '@/types/articles'
import { ProductCardProps } from '@/types/product'

type ContentItem = ProductCardProps | ArticleCardProps

interface PaginatedResponse {
	items: ContentItem[]
	totalCount: number
}

export interface GenericListPageProps {
	fetchData: (options: {
		pagination: { startIdx: number; perPage: number }
	}) => Promise<PaginatedResponse>
	pageTitle?: string
	basePath: string
	contentType?: string
}
