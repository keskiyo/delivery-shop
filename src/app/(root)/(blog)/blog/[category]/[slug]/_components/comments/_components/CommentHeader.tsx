'use client'

import { CommentHeaderProps } from '@/app/(root)/(blog)/blog/types/comments.types'
import { Edit, Trash2 } from 'lucide-react'
import { formatDate } from '../../../../../../../../../../utils/formatDate'
import { getAuthorBadges } from '../../../../utils/getAuthorBadges'
import { CommentAvatar } from './CommentAvatar'

export default function CommentHeader({
	comment,
	canEdit,
	canDelete,
	isEditing,
	onEdit,
	onDelete,
	deleting,
	deleteButtonTitle,
}: CommentHeaderProps) {
	const authorBadges = getAuthorBadges(comment)

	return (
		<div className='flex justify-between items-start mb-2'>
			<div className='flex items-center gap-2'>
				<CommentAvatar
					authorId={comment.authorId}
					authorName={comment.authorName}
				/>
				<div>
					<div className='font-medium text-foreground flex items-center gap-2 flex-wrap'>
						<span>{comment.authorName}</span>
						{authorBadges.map((badge, index) => (
							<span
								key={index}
								className={`text-xs px-2 py-0.5 rounded-full ${badge.className}`}
							>
								{badge.text}
							</span>
						))}
					</div>
					<div className='text-xs text-muted-foreground'>
						{formatDate(comment.createdAt)}
						{comment.isEdited && comment.editedAt && (
							<> (изменено {formatDate(comment.editedAt)})</>
						)}
					</div>
				</div>
			</div>

			<div className='flex items-center gap-1'>
				{canEdit && !isEditing && (
					<button
						onClick={onEdit}
						className='p-1 text-muted-foreground hover:text-success cursor-pointer transition-custom'
						title='Редактировать'
					>
						<Edit className='w-4 h-4' />
					</button>
				)}
				{canDelete && (
					<button
						onClick={onDelete}
						disabled={deleting}
						className='p-1 text-muted-foreground hover:text-danger disabled:opacity-50 cursor-pointer transition-custom'
						title={deleteButtonTitle}
					>
						<Trash2 className='w-4 h-4' />
					</button>
				)}
			</div>
		</div>
	)
}
