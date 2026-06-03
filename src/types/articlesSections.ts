import { ArticleCardProps } from '@/types/articles'

export interface ArticlesSectionsProps {
	title: string
	viewAllLink?: {
		text: string
		href: string
	}
	articles: ArticleCardProps[]
	compact?: boolean
}
