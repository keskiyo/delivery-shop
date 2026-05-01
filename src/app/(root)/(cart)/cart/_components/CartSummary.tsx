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
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { ExtendedCartSummaryProps } from '@/types/cart'
import { FakePaymentData, PaymentSuccessData } from '@/types/payment'
import { ProductCardProps } from '@/types/product'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CONFIG } from '../../../../../../config/config'

/**
 * Компонент итоговой информации о заказе и оформления оплаты
 *
 * Отображает:
 * - Количество товаров и общую стоимость
 * - Скидки (от товаров и карты лояльности)
 * - Итоговую сумму к оплате
 * - Начисляемые бонусы
 * - Кнопки оформления заказа и выбора способа оплаты
 *
 * Логика работы:
 * 1. Показывает кнопку "Оформить заказ" если не в режиме checkout
 * 2. После нажатия показывает кнопки выбора способа оплаты
 * 3. При оплате наличными создает заказ через API
 * 4. После успешного оформления показывает сообщение с номером заказа
 *
 * Валидация:
 * - Минимальная сумма заказа
 * - Наличие товаров в корзине
 * - Заполненность адреса доставки (город, улица, дом)
 * - Выбор даты и времени доставки
 */
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

	// Фильтруем только товары с quantity > 0 (доступные для заказа)
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
	} = pricing

	// Рассчитываем использованные бонусы (не больше 10% от суммы заказа)
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
			alert('Ошибка при оформлении заказа')
		} finally {
			setIsProcessing(false)
		}
	}

	/**
	 * Обработчик оплаты наличными при получении
	 *
	 * Процесс:
	 * 1. Проверяет наличие данных доставки
	 * 2. Формирует массив товаров с финальными ценами (с учетом скидок и карты)
	 * 3. Отправляет заказ на сервер через createOrderAction
	 * 4. При успехе сохраняет номер заказа и переключает в режим "заказ оформлен"
	 * 5. При ошибке показывает alert с описанием проблемы
	 */
	const handleCashPayment = async () => {
		await handlePaymentResult('cash_on_delivery')
	}

	/**
	 * Обработчик онлайн-оплаты на сайте
	 */
	const handleOnlinePayment = async () => {
		if (!deliveryData) {
			console.error('Данные доставки не заполнены')
			return
		}

		setIsProcessing(true)

		try {
			const result = await createOrder('online')
			setOrderNumber(result.orderNumber)
			setCurrentOrderId(result.order._id)
			setShowPaymentModal(true)
		} catch (error) {
			console.error('Ошибка при создании заказа:', error)
			alert('Ошибка при оформлении заказа')
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
			await handlePaymentResult('online', paymentData)
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
		alert(`Ошибка оплаты: ${error}`)
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

	/**
	 * Проверяет валидность формы заказа
	 *
	 * Проверяет:
	 * - Заполненность адреса (город, улица, дом)
	 * - Выбор даты и времени доставки
	 * - Достижение минимальной суммы заказа
	 * - Наличие товаров в корзине
	 */
	const isFormValid = (): boolean => {
		if (!deliveryData) {
			return false
		}

		const { address, time } = deliveryData

		// Проверяем обязательные поля адреса
		const isAddressValid = Boolean(
			address.city?.trim() &&
			address.street?.trim() &&
			address.house?.trim(),
		)

		// Проверяем время доставки
		const isTimeValid = Boolean(time.date?.trim() && time.timeSlot?.trim())

		// Используем отфильтрованные товары
		const isValidForm =
			isAddressValid &&
			isTimeValid &&
			isMinimumReached &&
			visibleCartItems.length > 0

		return isValidForm
	}

	/**
	 * Проверяет возможность перехода к оплате
	 * Форма должна быть валидна и не должна быть в процессе обработки
	 */
	const canProceedWithPayment = (): boolean => {
		return isFormValid() && !isProcessing
	}
	return (
		<>
			{/* Блок с информацией о стоимости */}
			<PriceSummary
				visibleCartItems={visibleCartItems}
				totalMaxPrice={totalMaxPrice}
				totalDiscount={totalDiscount}
				finalPrice={finalPrice}
				totalBonuses={totalBonuses}
			/>

			{/* Блок с итоговой суммой и кнопками оформления */}
			<div className='w-full'>
				{/* Предупреждение о минимальной сумме заказа */}
				<MinimumOrderWarning isMinimumReached={isMinimumReached} />
				{isRepeatOrder || isCheckout ? (
					// Кнопки выбора способа оплаты (второй шаг)
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
					// Кнопка "Оформить заказ" (первый шаг)
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
