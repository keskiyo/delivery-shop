'use client'

import { addToCartAction } from '@/actions/addToCartActions'
import CartActionMessage from '@/components/shared/CartActionMessage'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'

/**
 * Компонент кнопки добавления товара в корзину
 * 
 * Функционал:
 * - Добавление товара в корзину по клику
 * - Показ сообщения об успехе/ошибке
 * - Обновление счетчика корзины после добавления
 * - Индикатор загрузки во время операции
 * 
 * Логика работы:
 * 1. При клике вызывает addToCartAction с productId
 * 2. Показывает индикатор загрузки (disabled кнопка)
 * 3. При успехе:
 *    - Показывает сообщение "Товар добавлен в корзину"
 *    - Обновляет данные корзины через fetchCart()
 * 4. При ошибке показывает сообщение об ошибке
 * 5. Сообщение автоматически скрывается через несколько секунд
 * 
 * Особенности:
 * - Кнопка блокируется во время загрузки
 * - Иконка корзины справа на кнопке
 * - Hover и active эффекты (тени)
 * - Сообщение показывается поверх кнопки (absolute positioning)
 * 
 * @param productId - ID товара для добавления в корзину
 */
const CartButton = ({ productId }: { productId: string }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [message, setMessage] = useState<{
		success: boolean
		message: string
	} | null>(null)

	const { fetchCart } = useCartStore()

	const handleSubmit = async () => {
		setIsLoading(true)
		setMessage(null)

		try {
			const result = await addToCartAction(productId)
			setMessage(result)
			if (result.success) {
				await fetchCart()
			}
		} catch {
			setMessage({
				success: false,
				message: 'Ошибка при добавлении в корзину',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='relative'>
			<form action={handleSubmit}>
				<button
					type='submit'
					disabled={isLoading}
					className='mb-2 h-10 md:h-15 w-full bg-[#ff6633] text-white text-base md:text-2xl p-4 flex justify-center items-center rounded hover:shadow-article active:shadow-button-active duration-300 cursor-pointer relative'
				>
					<ShoppingCart className='absolute right-4 h-8 w-8' />

					<p className='text-center'>В корзину</p>
				</button>
			</form>
			{message && (
				<CartActionMessage
					message={message}
					onClose={() => setMessage(null)}
				/>
			)}
		</div>
	)
}

export default CartButton
