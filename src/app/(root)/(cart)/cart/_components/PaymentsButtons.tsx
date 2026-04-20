import { buttonStyles } from '@/app/(root)/(auth)/styles'
import OrderSuccessMessage from '@/app/(root)/(cart)/cart/_components/OrderSuccessMessage'

const PaymentsButtons = ({
	isOrdered,
	canProceedWithPayment,
	onOnlinePayment,
	onCashPayment,
	isProcessing,
	orderNumber,
	paymentType,
}: {
	paymentType: 'cash' | 'online' | null
	isOrdered: boolean
	canProceedWithPayment: boolean
	onOnlinePayment: () => void
	onCashPayment: () => void
	isProcessing: boolean
	orderNumber: string | null
}) => {
	if (isOrdered && paymentType === 'cash') {
		// Сообщение об успешном оформлении заказа
		return <OrderSuccessMessage orderNumber={orderNumber} />
	}

	if (isOrdered) return null

	return (
		<div className='flex flex-col gap-3'>
			{/* Онлайн-оплата (пока не реализована) */}
			<button
				disabled={!canProceedWithPayment}
				onClick={onOnlinePayment}
				className={`rounded w-full text-xl h-15 items-center justify-center ${
					canProceedWithPayment
						? buttonStyles.active
						: buttonStyles.inactive
				}`}
			>
				{isProcessing ? 'Обработка...' : 'Оплатить на сайте'}
			</button>

			{/* Оплата наличными при получении */}
			<button
				disabled={!canProceedWithPayment}
				onClick={onCashPayment}
				className={`h-10 rounded w-full text-base items-center justify-center duration-300 ${
					canProceedWithPayment
						? 'bg-green-600 hover:shadow-button-default active:shadow-button-active text-white cursor-pointer'
						: 'bg-gray-300 text-gray-500 cursor-not-allowed'
				}`}
			>
				{isProcessing ? 'Оформление...' : 'Оплатить при получении'}
			</button>
		</div>
	)
}

export default PaymentsButtons
