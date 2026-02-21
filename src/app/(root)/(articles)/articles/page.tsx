import ArticleSection from '@/app/(root)/(articles)/ArticlesSection'
import fetchArticles from '@/app/(root)/(articles)/fetchArticles'
// import { getArticles } from '@/lib/services/article.service'

export const metadata = {
	title: 'Статьи на сайте магазина "Фудмаркет"',
	description: 'Читайте статьи на сайте магазина "Фудмаркет"',
}

const AllArticles = async () => {
	try {
		const articles = await fetchArticles()

		return (
			<ArticleSection
				title='Все статьи'
				viewAllLink={{ text: 'На главную', href: '/' }}
				articles={articles}
			/>
		)
	} catch {
		return (
			<div className='text-red-500'>
				Ошибка: не удалось загрузить статьи
			</div>
		)
	}
}

export default AllArticles
