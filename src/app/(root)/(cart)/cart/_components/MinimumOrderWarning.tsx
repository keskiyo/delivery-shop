import { CONFIG } from '../../../../../../config/config'

const MinimumOrderWarning = ({
	isMinimumReached,
}: {
	isMinimumReached: boolean
}) => {
	if (isMinimumReached) return null
	return (
		<div className='bg-[#d80000] rounded text-white text-xs text-center mx-auto py-0.75 px-1.5 mb-4 w-full'>
			Минимальная сумма заказа {CONFIG.MIN_ORDER_PRICE} р
		</div>
	)
}

export default MinimumOrderWarning
