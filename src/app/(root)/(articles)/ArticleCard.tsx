import { ArticleCardProps } from '@/types/articles'
import Image from 'next/image'
import Link from 'next/link'
import { getColorFromName } from '../../../../utils/getColorFromName'

const ArticleCard = ({
	slug,
	categorySlug,
	name,
	image,
	imageAlt,
	categoryName,
	description,
	publishedAt,
}: ArticleCardProps) => {
	const articleTitle = name?.trim() || 'Статья'
	const articleDescription =
		description?.trim() || 'Описание статьи скоро появится'
	const categoryLabel = categoryName?.trim() || 'Без категории'

	const safeCategorySlug = categorySlug?.trim()
	const safeSlug = slug?.trim()

	const articleUrl =
		safeCategorySlug && safeSlug
			? `/blog/${safeCategorySlug}/${safeSlug}`
			: '/blog'
	const gradientClass = getColorFromName(articleTitle)
	const formattedDate = publishedAt
		? new Date(publishedAt).toLocaleDateString('ru-RU')
		: ''

	return (
		<Link
			href={articleUrl}
			className='block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
			aria-label={`Открыть статью ${articleTitle}`}
		>
			<article className='group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-(--shadow-default) transition transition-custom hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-(--shadow-article)'>
				<div className='relative h-48 w-full overflow-hidden bg-surface-subtle'>
					{image ? (
						<Image
							src={image}
							alt={imageAlt || articleTitle}
							fill
							priority={false}
							className='object-cover transition transition-custom group-hover:scale-105'
							sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
							unoptimized
						/>
					) : (
						<div
							className={`flex h-full w-full items-center justify-center bg-linear-to-br ${gradientClass}`}
						>
							<div className='p-4 text-center text-white'>
								<div className='px-4 text-xl font-semibold leading-tight'>
									{articleTitle}
								</div>
							</div>
						</div>
					)}
				</div>

				<div className='flex flex-1 flex-col p-4'>
					<div className='mb-3 flex items-center justify-between gap-3'>
						<span className='max-w-[60%] truncate rounded bg-brand-soft px-2 py-1 text-xs font-medium text-brand'>
							{categoryLabel}
						</span>
						{formattedDate && (
							<time className='shrink-0 text-xs text-muted-foreground'>
								{formattedDate}
							</time>
						)}
					</div>

					<h3 className='mb-2 line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-brand'>
						{articleTitle}
					</h3>

					<p className='mb-4 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground'>
						{articleDescription}
					</p>

					<div className='mt-auto'>
						<div className='w-full rounded bg-brand-soft py-2 text-center text-sm font-medium text-brand transition transition-custom group-hover:bg-brand group-hover:text-white'>
							Подробнее
						</div>
					</div>
				</div>
			</article>
		</Link>
	)
}

export default ArticleCard
