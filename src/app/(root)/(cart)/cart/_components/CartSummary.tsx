import CheckoutButton from '@/app/(root)/(cart)/cart/_components/CheckoutButton'
import MinimumOrderWarning from '@/app/(root)/(cart)/cart/_components/MinimumOrderWarning'
import PaymentsButtons from '@/app/(root)/(cart)/cart/_components/PaymentsButtons'
import PriceSummary from '@/app/(root)/(cart)/cart/_components/PriceSummary'
import {
	clearUserCart,
	createOrderRequest,
	markPaymentAsFailed,
	prepareCartItemsWithPrices,
	updateUserAfterPayment,
} from '@/app/(root)/(cart)/cart/utils/orderHelpers'
import FakePaymentModal from '@/app/(root)/(payment)/FakePaymentModal'
import PaymentSuccessModal from '@/app/(root)/(payment)/PaymentSuccessModal'
import { showPromiseToast, showToast } from '@/lib/showToast'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { ExtendedCartSummaryProps } from '@/types/cart'
import { FakePaymentData, PaymentSuccessData } from '@/types/payment'
import { ProductCardProps } from '@/types/product'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CONFIG } from '../../../../../../config/config'


const CartSummary = ({
	deliveryData,
	productsData = {},
	onOrderSuccess,
	isRepeatOrder = false,
	customPricing,
	customCartItems,
}: ExtendedCartSummaryProps) => {
	const [isProcessing, setIsProcessing] = useState(false)
	const [orderNumber, setOrderNumber] = useState<string | null>(null)
	const [currentsOrderId, setCurrentOrderId] = useState<string | null>(null)
	const [paymentType, setPaymentType] = useState<
		'cash_on_delivery' | 'online' | null
	>(null)
	const [showPaymentModal, setShowPaymentModal] = useState(false)
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const [successData, setSuccessData] = useState<PaymentSuccessData | null>(
		null,
	)
	const router = useRouter()

	const { user } = useAuthStore()
	const actualHasLoyaltyCard = !!user?.card

	const {
		pricing,
		cartItems,
		hasLoyaltyCard,
		isCheckout,
		setIsCheckout,
		isOrdered,
		setIsOrdered,
		useBonuses,
		resetAfterOrder,
		updatePricing,
	} = useCartStore()


	const visibleCartItems =
		isRepeatOrder && customCartItems
			? customCartItems
			: cartItems.filter(item => item.quantity > 0)

	const currentPricing =
		isRepeatOrder && customPricing ? customPricing : pricing

	const {
		totalPrice,
		totalMaxPrice,
		totalDiscount,
		finalPrice,
		totalBonuses,
		maxBonusUse,
		isMinimumReached,
	} = currentPricing


	const usedBonuses = Math.min(
		maxBonusUse,
		Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100),
	)

	const actualUsedBonuses = useBonuses ? usedBonuses : 0

	const createOrder = async (
		paymentMethod: 'cash_on_delivery' | 'online',
		paymentId?: string,
	) => {
		if (!deliveryData) {
			throw new Error('Данные доставки не заполнены')
		}

		if (isRepeatOrder) {
			updatePricing({
				...currentPricing,
				totalBonuses,
			})
		}

		const effectiveHasLoyaltyCard = isRepeatOrder
			? actualHasLoyaltyCard
			: hasLoyaltyCard

		const cartItemsWithPrices = prepareCartItemsWithPrices(
			visibleCartItems,
			productsData as { [key: string]: ProductCardProps },
			effectiveHasLoyaltyCard,
		)

		const orderData = {
			finalPrice,
			totalBonuses,
			usedBonuses: actualUsedBonuses,
			totalDiscount,
			deliveryAddress: deliveryData.address,
			deliveryTime: deliveryData.time,
			cartItems: cartItemsWithPrices,
			totalPrice: totalMaxPrice,
			paymentMethod,
			paymentId,
		}

		return await createOrderRequest(orderData)
	}

	const handlePaymentResult = async (
		paymentMethod: 'cash_on_delivery' | 'online',
		paymentData?: FakePaymentData,
	) => {
		if (!deliveryData) {
			console.error('Данные доставки не заполнены')
			return
		}

		setIsProcessing(true)
		setPaymentType(
			paymentMethod === 'online' ? 'online' : 'cash_on_delivery',
		)

		try {
			if (paymentMethod === 'online') {
				if (paymentData?.status === 'succeeded') {
					await updateUserAfterPayment({
						orderId: currentsOrderId!,
						usedBonuses: actualUsedBonuses,
						earnedBonuses: totalBonuses,
						purchasedProductIds: visibleCartItems.map(
							item => item.productId,
						),
					})
				}

				const successModalData: PaymentSuccessData = {
					orderNumber: orderNumber!,
					paymentId: paymentData!.id,
					amount: finalPrice,
					cardLast4: paymentData!.cardLast4,
				}

				setSuccessData(successModalData)
				setShowSuccessModal(true)
				setIsOrdered(true)

				await clearUserCart()
			} else {
				const result = await createOrder(paymentMethod, paymentData?.id)
				await clearUserCart()
				setOrderNumber(result.orderNumber)
				setIsOrdered(true)
			}

			setIsOrdered(true)
		} catch (error) {
			console.error(`Ошибка:`, error)
			throw error
		} finally {
			setIsProcessing(false)
		}
	}


	const handleCashPayment = async () => {
		try {
			await showPromiseToast(handlePaymentResult('cash_on_delivery'), {
				pending: 'Оформляем заказ...',
				success: 'Заказ оформлен',
				error: 'Ошибка при оформлении заказа',
			})
		} catch (error) {
			console.error('Ошибка при оформлении заказа:', error)
		}
	}


	const handleOnlinePayment = async () => {
		if (!deliveryData) {
			console.error('Данные доставки не заполнены')
			return
		}

		setIsProcessing(true)

		try {
			const result = await showPromiseToast(createOrder('online'), {
				pending: 'Создаем заказ...',
				success: 'Заказ создан',
				error: 'Ошибка при оформлении заказа',
			})
			setOrderNumber(result.orderNumber)
			setCurrentOrderId(result.order._id)
			setShowPaymentModal(true)
		} catch (error) {
			console.error('Ошибка при создании заказа:', error)
		} finally {
			setIsProcessing(false)
		}
	}

	const handleClosePaymentModal = () => {
		setShowPaymentModal(false)
	}

	const handlePaymentSuccess = async (paymentData: FakePaymentData) => {
		setShowPaymentModal(false)
		try {
			await showPromiseToast(handlePaymentResult('online', paymentData), {
				pending: 'Подтверждаем оплату...',
				success: 'Оплата подтверждена',
				error: 'Ошибка при оформлении заказа',
			})
		} catch (error) {
			console.error('Ошибка обработки заказа: ', error)
		}
	}

	const handlePaymentError = async (error: string) => {
		setShowPaymentModal(false)
		if (currentsOrderId) {
			await markPaymentAsFailed(currentsOrderId)
		} else {
			console.error('Order Id не найден для отмены оплаты')
		}
		showToast({
			type: 'error',
			message: `Ошибка оплаты: ${error}`,
		})
		resetAfterOrder()
		await clearUserCart()
		router.push('/user-orders')
	}

	const handleCloseSuccessModal = () => {
		setShowSuccessModal(false)
		if (isRepeatOrder && onOrderSuccess) {
			onOrderSuccess()
		}
		setIsOrdered(true)
		resetAfterOrder()
		router.push('/user-orders')
	}


	const isFormValid = (): boolean => {
		if (!deliveryData) {
			return false
		}

		const { address, time } = deliveryData


		const isAddressValid = Boolean(
			address.city?.trim() &&
			address.street?.trim() &&
			address.house?.trim(),
		)


		const isTimeValid = Boolean(time.date?.trim() && time.timeSlot?.trim())


		const isValidForm =
			isAddressValid &&
			isTimeValid &&
			isMinimumReached &&
			visibleCartItems.length > 0

		return isValidForm
	}


	const canProceedWithPayment = (): boolean => {
		return isFormValid() && !isProcessing
	}
	return (
		<>
						<PriceSummary
				visibleCartItems={visibleCartItems}
				totalMaxPrice={totalMaxPrice}
				totalDiscount={totalDiscount}
				finalPrice={finalPrice}
				totalBonuses={totalBonuses}
			/>

						<div className='w-full'>
								<MinimumOrderWarning isMinimumReached={isMinimumReached} />
				{isRepeatOrder || isCheckout ? (

					<PaymentsButtons
						isOrdered={isOrdered}
						isProcessing={isProcessing}
						onOnlinePayment={handleOnlinePayment}
						onCashPayment={handleCashPayment}
						canProceedWithPayment={canProceedWithPayment()}
						orderNumber={orderNumber}
						paymentType={paymentType}
					/>
				) : (

					<CheckoutButton
						isCheckout={isCheckout}
						isMinimumReached={isMinimumReached}
						onCheckout={() => setIsCheckout(true)}
						visibleCartItemsCount={visibleCartItems.length}
					/>
				)}
			</div>
			<FakePaymentModal
				amount={finalPrice}
				isOpen={showPaymentModal}
				onClose={handleClosePaymentModal}
				onSuccess={handlePaymentSuccess}
				onError={handlePaymentError}
			/>

			<PaymentSuccessModal
				isOpen={showSuccessModal}
				onClose={handleCloseSuccessModal}
				successData={successData}
			/>
		</>
	)
}

export default CartSummary
