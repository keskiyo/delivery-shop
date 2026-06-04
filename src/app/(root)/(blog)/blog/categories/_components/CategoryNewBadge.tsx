export default function CategoryNewBadge({ createdAt }: { createdAt: string }) {
	const createdDate = new Date(createdAt)
	const monthAgo = new Date()
	monthAgo.setMonth(monthAgo.getMonth() - 1)

	if (createdDate > monthAgo) {
		return (
			<div className='absolute right-3 top-3 z-10 rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-bold text-brand shadow-(--shadow-default)'>
				Новое
			</div>
		)
	}

	return null
}
