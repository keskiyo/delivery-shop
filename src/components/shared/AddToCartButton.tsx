'use client'

import { addToCartAction } from '@/actions/addToCartActions'
import {
	removeMultipleOrderItemsAction,
	updateOrderItemQuantityAction,
} from '@/actions/orderActions'
import Tooltip from '@/app/(root)/(auth)/_components/Tooltip'
import QuantitySelector from '@/app/(root)/(cart)/cart/_components/QuantitySelector'
import { showPromiseToast, showToast } from '@/lib/showToast'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

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
			const result = await showPromiseToast(
				(async () => {
					const result = await addToCartAction(productId)

					if (!result.success) {
						throw new Error(
							result.message || 'Ошибка добавления в корзину',
						)
					}

					return result
				})(),
				{
					pending: 'Добавляем товар в корзину...',
					success: 'Товар добавлен в корзину',
					error: 'Ошибка добавления в корзину',
				},
			)

			if (result.success) {
				await fetchCart()
			}
		} catch (error) {
			console.error('Ошибка добавления товара в корзину:', error)
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
			showToast({
				type: 'error',
				message: 'Ошибка обновления количества товара',
			})
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
				<button
					onClick={handleAddToCart}
					disabled={
						isLoading || hasReachedMaxQuantity || isOutOfStock
					}
					className={`absolute bottom-2 left-2 right-2 flex h-10 items-center justify-center rounded border transition-custom select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
						isOutOfStock || hasReachedMaxQuantity
							? 'bg-muted text-white border-muted cursor-not-allowed'
							: 'border-brand text-brand hover:text-white hover:bg-brand hover:border-transparent active:shadow-button-active cursor-pointer'
					}`}
				>
					{getButtonText()}
				</button>
			)}
		</div>
	)
}

export default AddToCartButton
