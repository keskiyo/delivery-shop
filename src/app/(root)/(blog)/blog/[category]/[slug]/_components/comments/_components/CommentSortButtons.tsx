'use client'

import { CommentSortButtonsProps } from '@/app/(root)/(blog)/blog/types/comments.types'
import { memo } from 'react'

export const CommentSortButtons = memo(
	({ sortOrder, onSortChange }: CommentSortButtonsProps) => {
		return (
			<div className='flex rounded-full shadow-sm'>
				<button
					onClick={() => onSortChange('newest')}
					className={`
          px-4 py-2 text-sm font-medium rounded-l-full border cursor-pointer transition-custom
          ${
				sortOrder === 'newest'
					? 'bg-promo text-white border-promo hover:bg-promo-hover'
					: 'bg-card text-foreground border-border hover:bg-surface-hover'
			}
        `}
					aria-pressed={sortOrder === 'newest'}
				>
					Сначала новые
				</button>
				<button
					onClick={() => onSortChange('oldest')}
					className={`
          px-4 py-2 text-sm font-medium rounded-r-full border-t border-b border-r cursor-pointer transition-custom
          ${
				sortOrder === 'oldest'
					? 'bg-promo text-white border-promo hover:bg-promo-hover'
					: 'bg-card text-foreground border-border hover:bg-surface-hover'
			}
        `}
					aria-pressed={sortOrder === 'oldest'}
				>
					Сначала старые
				</button>
			</div>
		)
	},
)

CommentSortButtons.displayName = 'CommentSortButtons'
