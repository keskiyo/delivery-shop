export default function StatsInfo({ count }: { count: number }) {
	return (
		<div className='mt-12 border-t border-border pt-6 text-center'>
			<p className='text-muted-foreground text-sm'>
				Всего категорий:{' '}
				<span className='font-semibold text-foreground'>{count}</span>
			</p>
		</div>
	)
}
