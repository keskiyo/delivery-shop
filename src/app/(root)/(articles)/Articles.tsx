import ArticlesSection from '@/app/(root)/(articles)/ArticlesSection'
import fetchArticles from '@/app/(root)/(articles)/fetchArticles'
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
	} catch {
		return (
			<div className='text-red-500'>
				Ошибка: Не удалось загрузить статьи
			</div>
		)
	}
}

export default Articles
