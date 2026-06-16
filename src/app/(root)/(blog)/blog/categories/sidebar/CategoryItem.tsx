import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { BlogCategoryItemProps } from '../types/sidebar.types'

export default function CategoryItem({
	category,
	index,
	onClick,
}: BlogCategoryItemProps) {
	return (
		<Link href={`/blog/${category.slug}`} onClick={onClick}>
			<div
				className='group my-1 animate-slide-in rounded-md border border-border p-4 transition-custom hover:border-brand hover:bg-surface-hover'
				style={{ animationDelay: `${index * 0.03}s` }}
			>
				<div className='flex items-center justify-between gap-3'>
					<div className='min-w-0 flex-1'>
						<div className='mb-2 flex items-center gap-3'>
							<div className='h-2 w-2 shrink-0 rounded-full bg-brand' />
							<h3 className='truncate font-medium text-foreground group-hover:text-brand'>
								{category.name}
							</h3>
						</div>
						{category.description && (
							<p className='line-clamp-2 text-sm text-muted-foreground'>
								{category.description}
							</p>
						)}
						{category.articleCount !== undefined && (
							<div className='mt-2'>
								<span className='inline-flex items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand'>
									{category.articleCount} статей
								</span>
							</div>
						)}
					</div>
					<ChevronRight className='h-5 w-5 shrink-0 text-muted-foreground transition-custom group-hover:translate-x-1 group-hover:text-brand' />
				</div>
			</div>
		</Link>
	)
}
