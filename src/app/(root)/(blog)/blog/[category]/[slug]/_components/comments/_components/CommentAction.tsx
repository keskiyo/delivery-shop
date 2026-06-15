'use client'

import { CommentActionsProps } from '@/app/(root)/(blog)/blog/types/comments.types'
import { Heart, Reply } from 'lucide-react'

export const CommentActions = ({
	isLiked,
	likeCount,
	onLike,
	liking,
	currentUserId,
	canReply,
	onReply,
}: CommentActionsProps) => {
	return (
		<div className='flex items-center gap-4 text-sm'>
			<button
				onClick={onLike}
				disabled={liking || !currentUserId}
				className={`flex items-center gap-1 cursor-pointer transition-custom ${
					isLiked
						? 'text-danger'
						: 'text-muted-foreground hover:text-danger'
				} disabled:opacity-50 disabled:cursor-not-allowed`}
			>
				<Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
				<span>{likeCount}</span>
			</button>
			{canReply && (
				<button
					onClick={onReply}
					className='text-muted-foreground hover:text-success flex items-center gap-1 cursor-pointer transition-custom'
				>
					<Reply className='w-4 h-4' />
					Ответить
				</button>
			)}
		</div>
	)
}
