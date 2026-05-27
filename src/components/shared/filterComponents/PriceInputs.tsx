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
	onFromChangeAction: (value: string) => void
	onToChangeAction: (value: string) => void
	min: number
	max: number
}) => {
	const step = 100

	const clamp = (value: number, minValue: number, maxValue: number) => {
		return Math.min(Math.max(value, minValue), maxValue)
	}

	const onlyNumbers = (value: string) => {
		return value.replace(/\D/g, '')
	}

	const fromValue = Number(from || min)
	const toValue = Number(to || max)

	const maxFromValue = to ? Number(to) : max
	const minToValue = from ? Number(from) : min

	const isFromMin = fromValue <= min
	const isFromMax = fromValue >= maxFromValue

	const isToMin = toValue <= minToValue
	const isToMax = toValue >= max

	const buttonClass = (disabled: boolean) =>
		`flex h-full w-8 shrink-0 items-center justify-center text-lg transition ${
			disabled
				? 'cursor-not-allowed text-muted-foreground opacity-40'
				: 'cursor-pointer text-muted-foreground hover:bg-promo hover:text-white'
		}`

	const changeFrom = (value: string) => {
		onFromChangeAction(onlyNumbers(value))
	}

	const changeTo = (value: string) => {
		onToChangeAction(onlyNumbers(value))
	}

	const decreaseFrom = () => {
		if (isFromMin) return

		const nextValue = clamp(fromValue - step, min, maxFromValue)
		onFromChangeAction(String(nextValue))
	}

	const increaseFrom = () => {
		if (isFromMax) return

		const nextValue = clamp(fromValue + step, min, maxFromValue)
		onFromChangeAction(String(nextValue))
	}

	const decreaseTo = () => {
		if (isToMin) return

		const nextValue = clamp(toValue - step, minToValue, max)
		onToChangeAction(String(nextValue))
	}

	const increaseTo = () => {
		if (isToMax) return

		const nextValue = clamp(toValue + step, minToValue, max)
		onToChangeAction(String(nextValue))
	}

	return (
		<div className='flex flex-row items-center justify-between gap-2'>
			<div className='flex h-10 w-31 items-center overflow-hidden rounded border border-border bg-input transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20'>
				<button
					type='button'
					onClick={decreaseFrom}
					disabled={isFromMin}
					className={buttonClass(isFromMin)}
					aria-label='Уменьшить минимальную цену'
				>
					−
				</button>

				<input
					type='text'
					inputMode='numeric'
					name='from'
					value={from}
					onChange={e => changeFrom(e.target.value)}
					placeholder={`${min}`}
					className='h-full min-w-0 flex-1 bg-transparent px-1 text-center text-sm text-foreground outline-none placeholder:text-muted-foreground'
				/>

				<button
					type='button'
					onClick={increaseFrom}
					disabled={isFromMax}
					className={buttonClass(isFromMax)}
					aria-label='Увеличить минимальную цену'
				>
					+
				</button>
			</div>

			<span className='text-base text-muted-foreground'>-</span>

			<div className='flex h-10 w-31 items-center overflow-hidden rounded border border-border bg-input transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20'>
				<button
					type='button'
					onClick={decreaseTo}
					disabled={isToMin}
					className={buttonClass(isToMin)}
					aria-label='Уменьшить максимальную цену'
				>
					−
				</button>

				<input
					type='text'
					inputMode='numeric'
					name='to'
					value={to}
					onChange={e => changeTo(e.target.value)}
					placeholder={`${max}`}
					className='h-full min-w-0 flex-1 bg-transparent px-1 text-center text-sm text-foreground outline-none placeholder:text-muted-foreground'
				/>

				<button
					type='button'
					onClick={increaseTo}
					disabled={isToMax}
					className={buttonClass(isToMax)}
					aria-label='Увеличить максимальную цену'
				>
					+
				</button>
			</div>
		</div>
	)
}

export default PriceInputs
