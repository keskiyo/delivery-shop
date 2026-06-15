import { Loader } from '@/components/features/common/loader'
import { CommentsListProps } from '../types/comments.types'
import { CommentRow } from './CommentRow'

export default function CommentsList({
	comments,
	loading,
	deletingId,
	onDelete,
}: CommentsListProps) {
	if (loading) {
		return <Loader />
	}

	if (comments.length === 0) {
		return (
			<div className='p-12 text-center'>
				<p className='text-muted-foreground'>
					Нет комментариев за выбранный период
				</p>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-3'>
			{comments.map(comment => (
				<div
					key={comment._id}
					className='flex-1 justify-center bg-card rounded border border-border shadow-sm hover:shadow-md transition-shadow transition-custom'
				>
					<div className='flex-1 justify-center hover:bg-surface-hover'>
						<CommentRow
							key={comment._id}
							comment={comment}
							deletingId={deletingId}
							onDelete={onDelete}
						/>
					</div>
				</div>
			))}
		</div>
	)
}
