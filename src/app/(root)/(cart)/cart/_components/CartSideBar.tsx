import BonusesSection from '@/app/(root)/(cart)/cart/_components/BonusesSection'
import CartSummary from '@/app/(root)/(cart)/cart/_components/CartSummary'
import { CartSidebarProps } from '@/types/cart'

const CardSideBar = ({
	bonusesCount,
	useBonuses,
	onUseBonusesChange,
	totalPrice,
	visibleCartItems,
	totalMaxPrice,
	totalDiscount,
	finalPrice,
	totalBonuses,
	isMinimumReached,
}: CartSidebarProps) => {
	return (
		<div className='flex flex-col gap-y-6 md:w-63.75 xl:w-68'>
			<BonusesSection
				bonusesCount={bonusesCount}
				useBonuses={useBonuses}
				onUseBonusesChange={onUseBonusesChange}
				totalPrice={totalPrice}
			/>

			<CartSummary
				visibleCartItems={visibleCartItems}
				totalMaxPrice={totalMaxPrice}
				totalDiscount={totalDiscount}
				finalPrice={finalPrice}
				totalBonuses={totalBonuses}
				isMinimumReached={isMinimumReached}
			/>
		</div>
	)
}

export default CardSideBar
