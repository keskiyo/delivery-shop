import BonusesSection from '@/app/(root)/(cart)/cart/_components/BonusesSection'
import CartSummary from '@/app/(root)/(cart)/cart/_components/CartSummary'
import { CartSidebarProps } from '@/types/cart'

const CartSideBar = ({ deliveryData, productsData }: CartSidebarProps) => {
	return (
		<div className='flex flex-col gap-y-6 md:w-63.75 xl:w-68'>
			<BonusesSection />
			<CartSummary
				deliveryData={deliveryData}
				productsData={productsData}
			/>
		</div>
	)
}

export default CartSideBar
