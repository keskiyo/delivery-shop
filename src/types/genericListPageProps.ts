import { ArticlesProps } from '@/types/articles'
import { ProductCardProps } from '@/types/product'

type ContentItem = ProductCardProps | ArticlesProps

export interface GenericListPageProps {
	fetchData: () => Promise<ContentItem[]>
	pageTitle: string
	basePath: string
	errorMessage: string
	contentType?: 'articles'
}
