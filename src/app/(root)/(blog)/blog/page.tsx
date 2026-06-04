import { Metadata } from 'next'
import { baseUrl } from '../../../../../utils/baseUrl'
import CategoriesList from './categories/_components/CategoriesList'
import EmptyState from './categories/_components/EmptyState'
import PageHeader from './categories/_components/PageHeader'
import StatsInfo from './categories/_components/StatsInfo'
import CategoriesSidebar from './categories/sidebar/CategoriesSidebar'
import { getCategories } from './categories/utils/getCategories'

export const dynamic = 'force-dynamic'

const truncate = (str: string, maxLength: number): string => {
	if (str.length <= maxLength) return str
	return str.substring(0, maxLength - 3) + '...'
}

export async function generateMetadata(): Promise<Metadata> {
	const categories = await getCategories()
	const categoryNames = categories.map(cat => cat.name)

	const title =
		categoryNames.length > 0
			? truncate(`Блог: ${categoryNames.slice(0, 3).join(', ')}`, 60)
			: 'Блог'

	const description =
		categoryNames.length > 0
			? truncate(
					`Исследуйте статьи по категориям: ${categoryNames.slice(0, 8).join(', ')}.`,
					160,
				)
			: truncate('Блог с полезными статьями.', 160)

	const keywords = [...categoryNames.map(name => name.toLowerCase())]

	return {
		metadataBase: new URL(`${baseUrl}/blog`),
		title,
		description,
		alternates: {
			canonical: `${baseUrl}/blog`,
		},
		keywords: [...new Set(keywords)],
	}
}

export default async function BlogPage() {
	const categories = await getCategories()

	return (
		<div className='min-h-screen px-4 py-8 text-foreground'>
			<div className='container mx-auto'>
				<PageHeader />
				{categories.length === 0 ? (
					<EmptyState />
				) : (
					<>
						<CategoriesList categories={categories} />
						<StatsInfo count={categories.length} />
					</>
				)}
				<CategoriesSidebar categories={categories} />
			</div>
		</div>
	)
}
