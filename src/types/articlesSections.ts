import { ArticlesProps } from '@/types/articles'

export interface ArticlesSectionsProps {
	title: string
	viewAllLink: {
		text: string
		href: string
	}
	articles: ArticlesProps[]
	compact?: boolean
}
