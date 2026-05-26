interface StockWarningsAlertProps {
	warnings: string[]
	hasStockIssues: boolean
}

export const StockWarningsAlert: React.FC<StockWarningsAlertProps> = ({
	warnings,
	hasStockIssues,
}) => {
	if (warnings.length === 0) return null

	return (
		<div className='m-4 p-4 bg-warning-soft border border-warning/30 rounded-lg'>
			<h3 className='text-warning font-semibold mb-2'>
				Внимание: проблемы с количеством товаров
			</h3>
			<ul className='list-disc list-inside space-y-1'>
				{warnings.map((warning, index) => (
					<li key={index} className='text-warning text-sm'>
						{warning}
					</li>
				))}
			</ul>
			{hasStockIssues && (
				<p className='text-warning font-medium mt-2'>
					Невозможно создать повторный заказ до решения проблем с
					количеством товаров. Оформите заказ через добавление товаров
					в корзину
				</p>
			)}
		</div>
	)
}
