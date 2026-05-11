'use client'

/**
 * Заголовок блока фильтра по цене
 *
 * Содержит:
 * - Надпись "Цена"
 * - Кнопка "Очистка" для сброса ценового диапазона
 *
 * @param resetPriceFitlter - Функция сброса ценового фильтра
 *
 * Используется в:
 * - PriceFilter.tsx
 */
const PriceFilterHeader = ({
	resetPriceFitlter,
}: {
	resetPriceFitlter: () => void
}) => {
	return (
		<div className='flex flex-row justify-between items-center'>
			<p className='text-base'>Цена</p>
			<button
				type='button'
				onClick={resetPriceFitlter}
				className='text-xs rounded h-8 p-2 cursor-pointer hover:bg-green-600 duration-300 hover:text-white'
			>
				Очистка
			</button>
		</div>
	)
}

export default PriceFilterHeader
