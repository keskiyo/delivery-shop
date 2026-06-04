import { BlogCategoryMetaProps } from '../types/categories.types'

export default function CategoryMeta({
  createdAt,
  author,
}: BlogCategoryMetaProps) {
	const formattedDate = new Date(createdAt).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})

	return (
		<div className='mb-3 flex items-center justify-between gap-3'>
			<time
				dateTime={createdAt}
				className='text-xs font-medium text-muted-foreground'
				title={formattedDate}
			>
				{formattedDate}
			</time>

			{author && (
				<div className='flex min-w-0 items-center'>
					<div className='mr-1.5 h-2 w-2 shrink-0 rounded-full bg-brand'></div>
					<span className='truncate text-xs font-medium text-muted-foreground'>
						{author}
					</span>
				</div>
			)}
		</div>
	)
}
