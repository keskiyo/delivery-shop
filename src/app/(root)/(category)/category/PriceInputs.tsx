const PriceInputs = ({
	from,
	to,
	min,
	max,
	onFromChangeAction,
	onToChangeAction,
}: {
	from: string
	to: string
	onFromChangeAction: (e: string) => void
	onToChangeAction: (e: string) => void
	min: number
	max: number
}) => {
	return (
		<div className='flex flex-row items-center justify-between gap-2'>
			<input
				type='number'
				name='from'
				value={from}
				onChange={e => onFromChangeAction(e.target.value)}
				min={min}
				max={max}
				placeholder={`${min} ₽`}
				className='w-31 h-10 border rounded py-2 px-4 bg-white text-gray-500'
			/>
			<p className='text-base'>-</p>
			<input
				type='number'
				name='to'
				value={to}
				onChange={e => onToChangeAction(e.target.value)}
				min={min}
				max={max}
				placeholder={`${max} ₽`}
				className='w-31 h-10 border rounded py-2 px-4 bg-white text-gray-500'
			/>
		</div>
	)
}

export default PriceInputs
