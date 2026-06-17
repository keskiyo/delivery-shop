import ArticlesSection from '@/app/(root)/(articles)/ArticlesSection'
import fetchArticles from '@/app/(root)/(articles)/fetchArticles'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { CONFIG } from '../../../../config/config'

const Articles = async () => {
	let items = []

	try {
		const data = await fetchArticles({
			articlesLimit: CONFIG.ITEMS_PER_PAGE_MAIN_ARTICLES,
		})
		items = data.items
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

	return (
		<ArticlesSection
			title='Статьи'
			viewAllLink={{ text: 'Все статьи', href: '/blog' }}
			articles={items}
		/>
	)
}

export default Articles
