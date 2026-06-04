import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BlogCategoryContentProps } from '../types/categories.types'
import CategoryMeta from './CategoryMeta'

export default function CategoryContent({
	createdAt,
	author,
	name,
	description,
	slug,
}: BlogCategoryContentProps) {
	const category = slug

	return (
		<div className='flex flex-1 flex-col p-5 md:p-6'>
			<CategoryMeta createdAt={createdAt} author={author} />
			<h2 className='mb-3 line-clamp-2 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-brand md:text-2xl'>
				{name}
			</h2>

			<p className='mb-5 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground md:text-base'>
				{description}
			</p>

			<div className='mt-auto border-t border-border pt-4'>
				<div className='flex items-center justify-between'>
					<div className='text-xs text-muted-foreground'>
						К статье
					</div>
					<Link
						href={`/blog/${category}`}
						className='group/btn inline-flex items-center justify-center gap-2 rounded bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground duration-300 hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 focus:ring-offset-background'
						aria-label={`Перейти к категории ${name}`}
					>
						<span>Подробнее</span>
						<ArrowRight
							className='h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1'
							strokeWidth={2}
						/>
					</Link>
				</div>
			</div>
		</div>
	)
}
