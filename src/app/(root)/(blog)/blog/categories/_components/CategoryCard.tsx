import Link from 'next/link'
import { getColorFromName } from '../../../../../../../utils/getColorFromName'
import { BlogCategoryCardProps } from '../types/categories.types'
import CategoryContent from './CategoryContent'
import CategoryHoverEffect from './CategoryHoverEffect'
import CategoryImage from './CategoryImage'
import CategoryNewBadge from './CategoryNewBadge'

export default function CategoryCard({
	category,
	priority = false,
}: BlogCategoryCardProps) {
	const hasImage = category.image && category.image.trim() !== ''
	const gradientClass = getColorFromName(category.name)
	const description =
		category.description || 'Исследуйте материалы по этой теме'

	return (
		<Link
			href={`/blog/${category.slug}`}
			className='block h-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
			aria-label={`Перейти к категории ${category.name}`}
		>
			<article className='group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-card shadow-(--shadow-default) transition-custom hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-(--shadow-article)'>
				<CategoryNewBadge createdAt={category.createdAt} />
				<CategoryImage
					hasImage={hasImage}
					image={category.image}
					imageAlt={category.imageAlt || category.name}
					gradientClass={gradientClass}
					name={category.name}
					priority={priority}
				/>
				<CategoryContent
					createdAt={category.createdAt}
					author={category.author}
					name={category.name}
					description={description}
					slug={category.slug}
				/>
				<CategoryHoverEffect />
			</article>
		</Link>
	)
}
