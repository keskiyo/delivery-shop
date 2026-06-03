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
		<div className='p-5 md:p-6 flex-1 flex flex-col'>
			<CategoryMeta createdAt={createdAt} author={author} />
			<h2 className='text-xl md:text-2xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-brand transition-colors duration-300'>
				{name}
			</h2>

			<p className='text-muted-foreground text-sm md:text-base mb-5 line-clamp-3 flex-1'>
				{description}
			</p>

			<div className='mt-auto pt-4 border-t border-border'>
				<div className='flex items-center justify-between'>
					<div className='text-xs text-muted-foreground'>
						К статье
					</div>
					<Link
						href={`/blog/${category}`}
						className='inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 text-sm font-semibold text-white bg-brand hover:bg-brand-hover duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 focus:ring-offset-background group/btn'
						aria-label={`Перейти к категории ${name}`}
					>
						<span>Подробнее</span>
						<ArrowRight
							className='w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1'
							strokeWidth={2}
						/>
					</Link>
				</div>
			</div>
		</div>
	)
}
