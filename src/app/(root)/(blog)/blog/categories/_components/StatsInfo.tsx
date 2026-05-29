export default function StatsInfo({ count }: { count: number }) {
	return (
		<div className='mt-16 pt-8 border-t border-border text-center'>
			<p className='text-muted-foreground text-sm'>
				Всего категорий: <span className='font-semibold'>{count}</span>
			</p>
		</div>
	)
}
