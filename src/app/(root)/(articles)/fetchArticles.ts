import { ArticlesProps } from '@/types/articles'

const fetchArticles = async () => {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL!}/api/articles`,
			{ next: { revalidate: 3600 } },
		)

		if (!res.ok) {
			throw new Error('Ошибка получения статей')
		}

		const articles: ArticlesProps[] = await res.json()

		return articles
	} catch (err) {
		console.error('Ошибка получения статей', err)
		throw err
	}
}

export default fetchArticles
