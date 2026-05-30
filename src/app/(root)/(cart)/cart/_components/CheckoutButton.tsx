import { buttonStyles } from '@/app/(root)/(auth)/styles'

const CheckoutButton = ({
	isMinimumReached,
	visibleCartItemsCount,
	onCheckout,
}: {
	isCheckout: boolean
	isMinimumReached: boolean
	visibleCartItemsCount: number
	onCheckout: () => void
}) => {
	return (
		<button
			onClick={onCheckout}
			disabled={!isMinimumReached || visibleCartItemsCount === 0}
			className={`p-3 rounded mx-auto w-full text-2xl  ${
				isMinimumReached && visibleCartItemsCount > 0
					? `${buttonStyles.active} cursor-pointer`
					: `${buttonStyles.inactive} cursor-not-allowed`
			}`}
		>
			Оформить заказ
		</button>
	)
}

export default CheckoutButton
