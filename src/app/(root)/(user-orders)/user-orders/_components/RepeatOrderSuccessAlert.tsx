'use client'

export const RepeatOrderSuccessAlert: React.FC = () => {
	const handleRefresh = () => {
		window.location.reload()
	}

	return (
		<div className='mt-6 p-4 bg-success-soft border border-success/30 rounded-lg'>
			<div className='flex items-center justify-between'>
				<p className='text-success font-medium'>
					Повторный заказ успешно создан!
				</p>
				<button
					onClick={handleRefresh}
					className='ml-4 bg-success text-success-foreground px-4 py-2 rounded hover:shadow-(--shadow-button-default) duration-300 font-medium cursor-pointer'
				>
					Обновить страницу
				</button>
			</div>
		</div>
	)
}
