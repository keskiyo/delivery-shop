import { memo } from 'react'
import { formatPrice } from '../../../../../../utils/formatPrice'

interface PriceDisplayProps {
	finalPrice: number
	priceWithDiscount: number
	totalFinalPrice: number
	totalPriceWithoutCard: number
	hasDiscount: boolean
	hasLoyaltyCard: boolean
	isOutOfStock: boolean
}

const PriceDisplay = memo(function PriceDisplay({
	finalPrice,
	priceWithDiscount,
	hasDiscount,
	isOutOfStock,
}: PriceDisplayProps) {
	return (
		<>
			<div className='mt-2 text-xs flex gap-x-2 items-baseline'>
				{hasDiscount ? (
					<>
						<div className='flex flex-col'>
							<span
								className={`font-bold text-[14px] ${isOutOfStock ? 'text-[#a8a8a8]' : ''}`}
							>
								{formatPrice(finalPrice)} ₽
							</span>
							<span className='text-[#bfbfbf]'>С картой</span>
						</div>
						<div className='flex flex-col'>
							<span
								className={`text-[12px] ${isOutOfStock ? 'line-through text-[#bfbfbf]' : ''}`}
							>
								{formatPrice(priceWithDiscount)} ₽
							</span>
							<span className='text-[#bfbfbf]'>Обычная</span>
						</div>
					</>
				) : (
					<div className='flex flex-col'>
						<span
							className={`font-bold ${isOutOfStock ? 'text-[#a8a8a8]' : ''}`}
						>
							{formatPrice(priceWithDiscount)} ₽
						</span>
					</div>
				)}
				<span className='text-[#bfbfbf]'>за шт.</span>
			</div>
		</>
	)
})

export default PriceDisplay
