'use client'

import { addToCartAction } from '@/actions/addToCartActions'
import {
	removeMultipleOrderItemsAction,
	updateOrderItemQuantityAction,
} from '@/actions/orderActions'
import Tooltip from '@/app/(root)/(auth)/_components/Tooltip'
import QuantitySelector from '@/app/(root)/(cart)/cart/_components/QuantitySelector'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

/**
 * Кнопка добавления товара в корзину с управлением количеством
 *
 * Функционал:
 * - Показывает кнопку "В корзину" если товара нет в корзине
 * - После добавления показывает селектор количества (-, количество, +)
 * - Обновляет количество товара с оптимистичным UI (сначала обновляет локально, потом на сервере)
 * - При количестве = 0 удаляет товар из корзины
 * - Показывает сообщения об ошибках
 *
 * Логика работы:
 * 1. Проверяет наличие товара в корзине через cartItems из Zustand store
 * 2. При клике "В корзину" вызывает addToCartAction (server action)
 * 3. После успешного добавления обновляет корзину через fetchCart
 * 4. При изменении количества сначала обновляет локальный store (оптимистичный UI)
 * 5. Затем отправляет запрос на сервер для сохранения изменений
 * 6. После завершения операции перезагружает корзину для синхронизации
 */
const AddToCartButton = ({
	productId,
	availableQuantity,
}: {
	productId: string
	availableQuantity: number
}) => {
	const [isLoading, setIsLoading] = useState(false)
	const [showTooltip, setShowTooltip] = useState(false)
	const [tooltipMessage, setTooltipMessage] = useState('')

	const { fetchCart, cartItems, updateCart } = useCartStore()

	// Находим товар в корзине и получаем его количество
	const cartItem = cartItems.find(item => item.productId === productId)
	const currentQuantity = cartItem ? cartItem.quantity : 0
	const isInCart = currentQuantity > 0

	const isOutOfStock = availableQuantity === 0
	const displayQuantity = Math.min(currentQuantity, availableQuantity)
	const hasReachedMaxQuantity = displayQuantity >= availableQuantity

	const showMessage = (message: string) => {
		setTooltipMessage(message)
		setShowTooltip(true)
		setTimeout(() => {
			setShowTooltip(false)
		}, 3000)
	}

	const handleAddToCart = async () => {
		if (hasReachedMaxQuantity) {
			showMessage(`Осталось ${availableQuantity} шт. этого товара`)
			return
		}
		setIsLoading(true)
		setShowTooltip(false)

		try {
			const result = await addToCartAction(productId)

			if (!result.success && result.message) {
				showMessage(result.message)
			}

			if (result.success) {
				await fetchCart()
			}
		} catch (error) {
			console.error('Ошибка добавления товара в корзину:', error)
			showMessage('Ошибка при добавлении в корзину')
		} finally {
			setIsLoading(false)
		}
	}

	const handleQuantityUpdate = async (newQuantity: number) => {
		if (newQuantity < 0 || isLoading) return

		if (newQuantity > availableQuantity) {
			showMessage(`Осталось ${availableQuantity} шт. этого товара`)
			return
		}

		setIsLoading(true)
		setShowTooltip(false)

		try {
			let updatedCartItems
			if (newQuantity === 0) {
				updatedCartItems = cartItems.filter(
					item => item.productId !== productId,
				)
				updateCart(updatedCartItems)
				await removeMultipleOrderItemsAction([productId])
			} else {
				updatedCartItems = cartItems.map(item =>
					item.productId === productId
						? { ...item, quantity: newQuantity }
						: item,
				)
				updateCart(updatedCartItems)
				await updateOrderItemQuantityAction(productId, newQuantity)
			}

			await fetchCart()
		} catch (error) {
			console.error('Ошибка обновления количества:', error)
			await fetchCart()
		} finally {
			setIsLoading(false)
		}
	}

	const handleDecrement = () => {
		const newQuantity = Math.max(0, currentQuantity - 1)
		handleQuantityUpdate(newQuantity)
	}

	const handleIncrement = () => {
		if (hasReachedMaxQuantity) {
			showMessage(`Осталось ${availableQuantity} шт. этого товара`)
			return
		}
		handleQuantityUpdate(currentQuantity + 1)
	}

	const getButtonText = () => {
		if (isOutOfStock) {
			return 'Нет в наличии'
		} else if (isLoading) {
			return '...'
		} else {
			return 'В корзину'
		}
	}

	return (
		<div className='relative'>
			{showTooltip && (
				<Tooltip
					text={tooltipMessage}
					position='top'
					cardPosition={true}
				/>
			)}
			{isInCart && !isOutOfStock ? (
				// Селектор количества (показывается когда товар уже в корзине)
				<div className='absolute flex justify-center bottom-2 left-2 right-2'>
					<QuantitySelector
						quantity={displayQuantity}
						isUpdating={isLoading}
						isOutOfStock={isOutOfStock}
						onDecrement={handleDecrement}
						onIncrement={handleIncrement}
						onProductCard={true}
					/>
				</div>
			) : (
				// Кнопка "В корзину" (показывается когда товара нет в корзине)
				<button
					onClick={handleAddToCart}
					disabled={
						isLoading || hasReachedMaxQuantity || isOutOfStock
					}
					className={`absolute border bottom-2 left-2 right-2 h-10 rounded justify-center items-center duration-300 select-none ${
						isOutOfStock || hasReachedMaxQuantity
							? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
							: 'border-green-600 text-green-600 hover:text-white hover:bg-[#ff6633] hover:border-transparent active:shadow-button-active cursor-pointer'
					}`}
				>
					{getButtonText()}
				</button>
			)}
		</div>
	)
}

export default AddToCartButton
