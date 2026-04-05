'use client'

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
				className='text-xs rounded h-8 p-2 cursor-pointer hover:bg-green-300 duration-300 hover:text-white'
			>
				Очистка
			</button>
		</div>
	)
}

export default PriceFilterHeader
