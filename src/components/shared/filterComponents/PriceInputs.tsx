/**
 * Инпуты для ввода минимальной и максимальной цены
 * 
 * Элементы:
 * - Input "от" (минимальная цена)
 * - Разделитель "-"
 * - Input "до" (максимальная цена)
 * 
 * Параметры:
 * - from/to: текущие значения (строки)
 * - min/max: диапазон допустимых значений
 * - onFromChangeAction/onToChangeAction: callbacks при изменении
 * 
 * Валидация:
 * - type="number" - только числа
 * - min/max - ограничения диапазона
 * - placeholder - подсказки с диапазоном
 * 
 * Используется в:
 * - PriceFilter.tsx
 */
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
				className='w-31 h-10 border border-border rounded py-2 px-4 bg-input text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20'
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
				className='w-31 h-10 border border-border rounded py-2 px-4 bg-input text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20'
			/>
		</div>
	)
}

export default PriceInputs
