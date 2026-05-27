export const WarningAlert = () => {
	return (
		<div className='my-6 p-4 bg-warning-soft rounded'>
			<p className='text-sm text-warning'>
				<strong>Внимание:</strong> Удаление категории допустимо только
				если в ней нет статей. При удалении категории все статьи должны
				быть перенесены в другие категории.
			</p>
		</div>
	)
}
