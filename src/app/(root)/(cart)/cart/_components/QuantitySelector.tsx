import { memo } from 'react'

interface QuantitySelectorProps {
	quantity: number
	isUpdating: boolean
	isOutOfStock: boolean
	onDecrement: () => void
	onIncrement: () => void
	onProductCard?: boolean
}

/**
 * Компонент селектора количества товара
 *
 * Отображает:
 * - Кнопку уменьшения количества (-)
 * - Текущее количество товара
 * - Кнопку увеличения количества (+)
 *
 * Особенности:
 * - Зеленый фон (bg-green-600)
 * - Белые иконки и текст
 * - Индикатор загрузки ("..." вместо количества)
 * - Блокировка кнопок при обновлении или отсутствии товара
 * - Адаптивная ширина (w-25 в корзине, w-full на карточке товара)
 *
 * Используется в:
 * - CartItem - для изменения количества в корзине
 * - AddToCartButton - для управления количеством на карточке товара
 *
 * @param quantity - Текущее количество товара
 * @param isUpdating - Идет ли обновление (показывает "...")
 * @param isOutOfStock - Нет ли товара в наличии (блокирует кнопки)
 * @param onDecrement - Callback для уменьшения количества
 * @param onIncrement - Callback для увеличения количества
 * @param onProductCard - Флаг использования на карточке товара (меняет ширину)
 */
const QuantitySelector = memo(function QuantitySelector({
	quantity,
	isUpdating,
	isOutOfStock,
	onDecrement,
	onIncrement,
	onProductCard,
}: QuantitySelectorProps) {
	return (
		<div
			className={`flex items-center bg-green-600 p-2 rounded text-white relative h-10 gap-2 ${
				onProductCard ? ' w-full justify-between' : 'w-25'
			}`}
		>
			{/* Кнопка уменьшения количества (-) */}
			<button
				onClick={onDecrement}
				disabled={quantity < 0 || isUpdating || isOutOfStock}
				className='w-6 h-6 rounded flex items-center justify-center duration-300 cursor-pointer disabled:opacity-50'
			>
				{/* Горизонтальная линия (минус) */}
				<div className='w-3.75 h-px bg-white'></div>
			</button>

			{/* Отображение количества или индикатора загрузки */}
			<span className='w-12 text-center text-base'>
				{isUpdating ? '...' : quantity}
			</span>

			{/* Кнопка увеличения количества (+) */}
			<button
				onClick={onIncrement}
				disabled={isUpdating || isOutOfStock}
				className='w-6 h-6 rounded flex items-center justify-center duration-300 cursor-pointer disabled:opacity-50'
			>
				{/* Иконка плюса (две пересекающиеся линии) */}
				<div className='relative w-3.75 h-3.75'>
					{/* Горизонтальная линия */}
					<div className='absolute top-1/2 left-0 w-full h-px bg-white transform -translate-y-1/2'></div>
					{/* Вертикальная линия */}
					<div className='absolute left-1/2 top-0 w-px h-full bg-white transform -translate-x-1/2'></div>
				</div>
			</button>
		</div>
	)
})

export default QuantitySelector
