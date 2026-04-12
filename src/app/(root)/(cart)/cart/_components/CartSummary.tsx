import { buttonStyles } from '@/app/(root)/(auth)/styles'
import Bonuses from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/Bonuses'
import { CartSummaryProps } from '@/types/cart'
import { CONFIG } from '../../../../../../config/config'
import { formatPrice } from '../../../../../../utils/formatPrice'
import { getWordEnding } from '../../../../../../utils/getWordEnding'

const CartSummary = ({
	visibleCartItems,
	totalMaxPrice,
	totalDiscount,
	finalPrice,
	totalBonuses,
	isMinimumReached,
}: CartSummaryProps) => {
	return (
		<>
			<div className='flex flex-col gap-y-2 pb-6 border-b-2 border-[#f3f2f1]'>
				<div className='flex flex-row justify-between'>
					<p className='text-[#bfbfbf]'>
						{visibleCartItems.length}{' '}
						{`товар${getWordEnding(visibleCartItems.length)}`}
					</p>
					<p className=''>{formatPrice(totalMaxPrice)} ₽</p>
				</div>

				<div className='flex flex-row justify-between'>
					<p className='text-[#bfbfbf]'>Скидка</p>
					<p className='text-[#ff6633] font-bold'>
						-{formatPrice(totalDiscount)} ₽
					</p>
				</div>
			</div>

			<div className='flex flex-col items-end justify-between gap-y-6'>
				<div className='text-base flex flex-row justify-between items-center w-full'>
					<span className='text-[#bfbfbf] '>Итог:</span>
					<span className='font-bold text-2xl'>
						{formatPrice(finalPrice)} ₽
					</span>
				</div>
				<Bonuses bonus={totalBonuses} />
				<div className='w-full'>
					{!isMinimumReached && (
						<div className='bg-[#d80000] rounded text-white text-xs text-center mx-auto py-0.75 px-1.5 mb-4 w-full'>
							Минимальная сумма заказа {CONFIG.MIN_ORDER_PRICE} р
						</div>
					)}

					<button
						disabled={
							!isMinimumReached || visibleCartItems.length === 0
						}
						className={`p-3 rounded mx-auto w-full text-2xl cursor-pointer ${
							isMinimumReached && visibleCartItems.length > 0
								? buttonStyles.active
								: buttonStyles.inactive
						}`}
					>
						Оформить заказ
					</button>
				</div>
			</div>
		</>
	)
}

export default CartSummary
