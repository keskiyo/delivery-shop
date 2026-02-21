import ArticlesSection from '@/app/(root)/(articles)/ArticlesSection'
import fetchArticles from '@/app/(root)/(articles)/fetchArticles'

const Articles = async () => {
	try {
		const articles = await fetchArticles()

		return (
			<ArticlesSection
				title='Статьи'
				articles={articles}
				viewAllLink={{ text: 'Все статьи', href: 'articles' }}
				compact
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
