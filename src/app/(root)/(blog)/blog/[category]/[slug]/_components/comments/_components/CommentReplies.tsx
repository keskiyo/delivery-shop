'use client'

import {
	CommentRepliesProps,
	IComment,
} from '@/app/(root)/(blog)/blog/types/comments.types'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { getReplyWord } from '../../../../utils/getReplayWord'
import { CommentItem } from './CommentItem'

export const CommentReplies = ({
	replies,
	articleId,
	depth,
	onCommentChange,
}: CommentRepliesProps) => {
	const [showReplies, setShowReplies] = useState(false)

	if (!replies.length) return null

	return (
		<div className='mt-2'>
			<button
				onClick={() => setShowReplies(!showReplies)}
				className='flex items-center gap-1 text-sm text-success hover:text-success mb-2 cursor-pointer transition-custom'
			>
				{showReplies ? (
					<ChevronUp className='w-4 h-4' />
				) : (
					<ChevronDown className='w-4 h-4' />
				)}
				<span>
					{replies.length} {getReplyWord(replies.length)}
				</span>
			</button>

			{showReplies && (
				<div className='space-y-4'>
					{replies.map((reply: IComment) => (
						<CommentItem
							key={reply._id}
							comment={reply}
							articleId={articleId}
							onCommentChange={onCommentChange}
							depth={depth + 1}
						/>
					))}
				</div>
			)}
		</div>
	)
}
