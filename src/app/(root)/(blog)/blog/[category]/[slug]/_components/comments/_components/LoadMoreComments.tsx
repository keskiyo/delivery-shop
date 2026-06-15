'use client'

import { LoadMoreCommentsProps } from '@/app/(root)/(blog)/blog/types/comments.types'
import { Eye } from 'lucide-react'

export const LoadMoreComments = ({
	hasMore,
	remainingCount,
	onLoadMore,
	totalRootComments,
}: LoadMoreCommentsProps) => {
	return (
		<>
			{hasMore && (
				<div className='flex justify-center pt-4'>
					<button
						onClick={onLoadMore}
						className='px-6 py-2.5 bg-promo-soft hover:bg-promo-soft text-foreground font-medium rounded-lg cursor-pointer transition-custom flex items-center gap-2'
					>
						<Eye className='md:hidden w-6 h-6 text-promo' />
						<span className='hidden md:inline-block text-promo'>
							Посмотреть еще
						</span>
						<span className='flex items-center justify-center bg-promo-soft px-2 py-0.5 rounded-full text-xs text-promo'>
							{remainingCount}
						</span>
					</button>
				</div>
			)}

			{!hasMore && totalRootComments > 5 && (
				<div className='text-center pt-4 text-sm text-muted-foreground'>
					Загружены все комментарии
				</div>
			)}
		</>
	)
}
