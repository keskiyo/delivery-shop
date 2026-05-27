export const MenuFooter = () => {
	return (
		<div className='pt-8 mt-8 border-t border-border'>
			<div className='text-center'>
				<div className='inline-flex items-center gap-2 px-4 py-2 bg-surface-subtle rounded-full shadow-sm'>
					<div className='w-2 h-2 bg-success rounded-full animate-pulse' />
					<span className='text-sm font-medium text-muted-foreground '>
						CMS Панель • v1.0
					</span>
				</div>
			</div>
		</div>
	)
}
