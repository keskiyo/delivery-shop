import { ArrowRight } from 'lucide-react'
import { BlogCategoryContentProps } from '../types/categories.types'
import CategoryMeta from './CategoryMeta'

export default function CategoryContent({
	createdAt,
	author,
	name,
	description,
}: BlogCategoryContentProps) {
	return (
		<div className='flex flex-1 flex-col p-5 md:p-6'>
			<CategoryMeta createdAt={createdAt} author={author} />
			<h2 className='mb-3 line-clamp-2 text-xl font-bold text-foreground transition-colors transition-custom group-hover:text-brand md:text-2xl'>
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
					<div className='inline-flex items-center justify-center gap-2 rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-custom group-hover:bg-brand-hover'>
						<span>Подробнее</span>
						<ArrowRight
							className='h-4 w-4 transition-transform transition-custom group-hover:translate-x-1'
							strokeWidth={2}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
