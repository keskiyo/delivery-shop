import Bonuses from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[slug]/_components/Bonuses'
import { CartItem } from '@/types/cart'
import { formatPrice } from '../../../../../../utils/formatPrice'
import { getWordEnding } from '../../../../../../utils/getWordEnding'

const PriceSummary = ({
	visibleCartItems,
	totalMaxPrice,
	totalDiscount,
	finalPrice,
	totalBonuses,
}: {
	visibleCartItems: CartItem[]
	totalMaxPrice: number
	totalDiscount: number
	finalPrice: number
	totalBonuses: number
}) => {
	return (
		<>
			<div className='flex flex-col gap-y-2 pb-6 border-b-2 border-[#f3f2f1] text-gray-800'>
				<div className='flex flex-row justify-between'>
					<p className='text-base'>
						{visibleCartItems.length}{' '}
						{`товар${getWordEnding(visibleCartItems.length)}`}
					</p>
					<p className=''>{formatPrice(totalMaxPrice)} ₽</p>
				</div>

				<div className='flex flex-row justify-between'>
					<p className='text-base'>Скидка</p>
					<p className='text-[#ff6633] font-bold'>
						-{formatPrice(totalDiscount)} ₽
					</p>
				</div>
			</div>

			<div className='flex flex-col items-end justify-between gap-y-6 text-gray-800'>
				<div className='text-base flex flex-row justify-between items-center w-full'>
					<span className='font-bold text-2xl '>Итог:</span>
					<span className='font-bold text-2xl'>
						{formatPrice(finalPrice)} ₽
					</span>
				</div>
				<Bonuses bonus={totalBonuses} />
			</div>
		</>
	)
}

export default PriceSummary
