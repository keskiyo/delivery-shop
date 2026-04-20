'use client'

import { addToCartAction } from '@/actions/addToCartActions'
import {
	removeMultipleOrderItemsAction,
	updateOrderItemQuantityAction,
} from '@/actions/orderActions'
import QuantitySelector from '@/app/(root)/(cart)/cart/_components/QuantitySelector'
import CartActionMessage from '@/components/shared/CartActionMessage'
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
const AddToCardButton = ({ productId }: { productId: string }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [message, setMessage] = useState<{
		success: boolean
		message: string
	} | null>(null)

	const { fetchCart, cartItems, updateCart } = useCartStore()
	
	// Находим товар в корзине и получаем его количество
	const cartItem = cartItems.find(item => item.productId === productId)
	const currentQuantity = cartItem ? cartItem.quantity : 0
	const isInCart = currentQuantity > 0

	/**
	 * Обработчик добавления товара в корзину
	 * Вызывается при клике на кнопку "В корзину"
	 */
	const handleAddToCart = async () => {
		setIsLoading(true)
		setMessage(null)

		try {
			const result = await addToCartAction(productId)

			// Показываем сообщение об ошибке, если есть
			if (!result.success && result.message) {
				setMessage(result)
			}

			// Обновляем корзину после успешного добавления
			if (result.success) {
				await fetchCart()
			}
		} catch (error) {
			console.error('Ошибка добавления в корзину: ', error)
			setMessage({
				success: false,
				message: 'Ошибка при добавлении в корзину',
			})
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Обработчик изменения количества товара
	 * 
	 * Оптимистичный UI:
	 * 1. Сначала обновляет локальный store (пользователь сразу видит изменения)
	 * 2. Затем отправляет запрос на сервер
	 * 3. После завершения перезагружает корзину для синхронизации
	 * 
	 * @param newQuantity - Новое количество товара (0 = удаление из корзины)
	 */
	const handleQuantityUpdate = async (newQuantity: number) => {
		if (newQuantity < 0 || isLoading) return

		setIsLoading(true)

		try {
			let updatedCartItems
			if (newQuantity === 0) {
				// Удаляем товар из корзины
				updatedCartItems = cartItems.filter(
					item => item.productId !== productId,
				)
				updateCart(updatedCartItems)
				await removeMultipleOrderItemsAction([productId])
			} else {
				// Обновляем количество товара
				updatedCartItems = cartItems.map(item =>
					item.productId === productId
						? { ...item, quantity: newQuantity }
						: item,
				)
				updateCart(updatedCartItems)
				await updateOrderItemQuantityAction(productId, newQuantity)
			}

			// Перезагружаем корзину для синхронизации с сервером
			await fetchCart()
		} catch (error) {
			console.error('Ошибка обновления количества:', error)
			// При ошибке перезагружаем корзину для восстановления корректного состояния
			await fetchCart()
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Уменьшает количество товара на 1
	 * Минимальное значение - 0 (удаление из корзины)
	 */
	const handleDecrement = () => {
		const newQuantity = Math.max(0, currentQuantity - 1)
		handleQuantityUpdate(newQuantity)
	}

	/**
	 * Увеличивает количество товара на 1
	 */
	const handleIncrement = () => {
		handleQuantityUpdate(currentQuantity + 1)
	}

	return (
		<div className='relative'>
			{isInCart ? (
				// Селектор количества (показывается когда товар уже в корзине)
				<div className='absolute flex justify-center bottom-2 left-2 right-2'>
					<QuantitySelector
						quantity={currentQuantity}
						isUpdating={isLoading}
						isOutOfStock={false}
						onDecrement={handleDecrement}
						onIncrement={handleIncrement}
						onProductCard={true}
					/>
				</div>
			) : (
				// Кнопка "В корзину" (показывается когда товара нет в корзине)
				<button
					onClick={handleAddToCart}
					disabled={isLoading}
					className='absolute border bottom-2 left-2 right-2 border-green-600 hover:text-white hover:bg-[#ff6633] hover:border-transparent active:shadow-(--shadow-button-active) h-10 rounded justify-center items-center text-green-600 transition-all duration-300 cursor-pointer select-none'
				>
					{isLoading ? '...' : 'В корзину'}
				</button>
			)}
			{/* Сообщение об ошибке (если есть) */}
			{message && (
				<CartActionMessage
					message={message}
					onClose={() => setMessage(null)}
				/>
			)}
		</div>
	)
}

export default AddToCardButton
