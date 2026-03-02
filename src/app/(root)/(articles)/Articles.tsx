import ArticlesSection from '@/app/(root)/(articles)/ArticlesSection'
import fetchArticles from '@/app/(root)/(articles)/fetchArticles'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { CONFIG } from '../../../../config/config'

const Articles = async () => {
	try {
		const { items } = await fetchArticles({
			articlesLimit: CONFIG.ITEMS_PER_PAGE_MAIN_ARTICLES,
		})

		return (
			<ArticlesSection
				title='Статьи'
				articles={items}
				viewAllLink={{ text: 'Все статьи', href: 'articles' }}
			/>
		)
	} catch (error) {
		return (
			<ErrorComponent
				error={
					error instanceof Error ? error : new Error(String(error))
				}
				userMessage='Не удалось загрузить статьи'
			/>
		)
	}
}

export default Articles
