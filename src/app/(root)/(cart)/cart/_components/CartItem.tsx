'use client'

import Tooltip from '@/app/(root)/(auth)/_components/Tooltip'
import CartSkeletons from '@/app/(root)/(cart)/cart/_components/CartSkeleton'
import DiscountBadge from '@/app/(root)/(cart)/cart/_components/DiscountBadge'
import PriceDisplay from '@/app/(root)/(cart)/cart/_components/PriceDisplay'
import ProductImage from '@/app/(root)/(cart)/cart/_components/ProductImage'
import QuantitySelector from '@/app/(root)/(cart)/cart/_components/QuantitySelector'
import SelectionCheckbox from '@/app/(root)/(cart)/cart/_components/SelectionCheckbox'
import { useCartStore } from '@/store/cartStore'
import { CartItemProps } from '@/types/cart'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import { CONFIG } from '../../../../../../config/config'
import {
	calculateFinalPrice,
	calculatePriceByCard,
} from '../../../../../../utils/calcPrices'
import { formatPrice } from '../../../../../../utils/formatPrice'

/**
 * Компонент элемента корзины
 *
 * Отображает:
 * - Чекбокс для выбора товара (для массового удаления)
 * - Изображение товара
 * - Название и описание товара (ссылка на страницу товара)
 * - Цены (базовая, со скидкой, с картой лояльности)
 * - Бейдж скидки (если есть)
 * - Селектор количества (-, количество, +)
 * - Итоговую стоимость товара
 *
 * Логика работы:
 * 1. Рассчитывает цены с учетом скидки товара и карты лояльности
 * 2. При изменении количества проверяет наличие на складе
 * 3. Если количество превышает доступное - показывает тултип
 * 4. Использует оптимистичный UI (сначала обновляет локально, потом на сервере)
 * 5. При ошибке откатывает изменения
 * 6. Для товаров "нет в наличии" скрывает селектор количества
 *
 * Особенности:
 * - Обернут в memo для оптимизации рендеринга
 * - Адаптивная верстка (мобильная/десктоп)
 * - Визуальная индикация товаров без наличия (opacity-60)
 */
const CartItem = memo(function CartItem({
	item,
	productData,
	isSelected,
	onSelectionChange,
	onQuantityUpdate,
}: CartItemProps) {
	const [quantity, setQuantity] = useState(item.quantity)
	const [isUpdating, setIsUpdating] = useState(false)
	const [showTooltip, setShowTooltip] = useState(false)
	const { hasLoyaltyCard } = useCartStore()

	useEffect(() => {
		if (!productData) return

		const maxQuantity = productData.quantity
		if (quantity > maxQuantity) {
			setQuantity(maxQuantity)
			onQuantityUpdate(item.productId, maxQuantity)
		}
	}, [quantity, productData, onQuantityUpdate, item.productId])

	/**
	 * Обработчик изменения количества товара
	 *
	 * Валидация:
	 * - Не позволяет отрицательные значения
	 * - Проверяет наличие на складе
	 * - Показывает тултип если превышен лимит
	 *
	 * Оптимистичный UI:
	 * 1. Сохраняет предыдущее значение
	 * 2. Обновляет локальное состояние
	 * 3. Вызывает callback для обновления на сервере
	 * 4. При ошибке откатывает к предыдущему значению
	 */
	const handleQuantityChange = async (newQuantity: number) => {
		if (newQuantity < 0) return
		if (!productData) return

		const maxQuantity = productData.quantity

		// Проверяем, не превышает ли новое количество доступное
		if (newQuantity > maxQuantity) {
			setShowTooltip(true)
			setTimeout(() => setShowTooltip(false), 3000)
			return
		}

		setIsUpdating(true)
		const previousQuantity = quantity
		setQuantity(newQuantity)

		try {
			onQuantityUpdate(item.productId, newQuantity)
		} catch (error) {
			console.error('Ошибка обновления количества:', error)
			// Откатываем изменения при ошибке
			setQuantity(previousQuantity)
		} finally {
			setIsUpdating(false)
		}
	}

	// Показываем скелетон если данные товара не загружены
	if (!productData) {
		return <CartSkeletons />
	}

	// Рассчитываем цены с учетом скидок
	const priceWithDiscount = calculateFinalPrice(
		productData?.basePrice || 0,
		productData?.discountPercent || 0,
	)

	// Применяем скидку по карте лояльности (если есть)
	const finalPrice = hasLoyaltyCard
		? calculatePriceByCard(priceWithDiscount, CONFIG.CARD_DISCOUNT_PERCENT)
		: priceWithDiscount

	// Итоговые цены с учетом количества
	const totalFinalPrice = finalPrice * quantity
	const totalPriceWithoutCard = priceWithDiscount * quantity

	const isOutOfStock = productData?.quantity === 0
	const hasDiscount = productData ? productData.discountPercent > 0 : false

	return (
		<div
			className={`
        bg-card rounded flex shadow-cart-item hover:shadow-article relative duration-300
        ${isOutOfStock ? 'opacity-60' : ''}
      `}
		>
			{/* Чекбокс для выбора товара */}
			<SelectionCheckbox
				isSelected={isSelected}
				onSelectionChange={checked =>
					onSelectionChange(item.productId, checked)
				}
			/>

			<div className='flex flex-row flex-wrap md:flex-row justify-between w-full md:flex-nowrap'>
				<div className='flex flex-row flex-wrap md:flex-nowrap'>
					{/* Изображение товара */}
					<ProductImage
						productId={item.productId}
						title={productData.title}
					/>

					{/* Информация о товаре */}
					<div className='flex-1 flex min-w-56 md:flex-initial flex-col gap-y-2 p-2'>
						{/* Ссылка на страницу товара */}
						<Link
							className='text-base hover:text-[#ff6633] cursor-pointer'
							href={`/catalog/${productData.categories[0]}/${item.productId}`}
						>
							{productData.description}
						</Link>

						{/* Цены и бейдж скидки */}
						<div className='flex flex-row gap-x-2 items-center'>
							<PriceDisplay
								finalPrice={finalPrice}
								priceWithDiscount={priceWithDiscount}
								totalFinalPrice={totalFinalPrice}
								totalPriceWithoutCard={totalPriceWithoutCard}
								hasDiscount={hasDiscount}
								hasLoyaltyCard={hasLoyaltyCard}
								isOutOfStock={isOutOfStock}
							/>

							{hasDiscount && (
								<DiscountBadge
									discountPercent={
										productData.discountPercent
									}
								/>
							)}
						</div>
					</div>
				</div>

				{/* Тултип при превышении доступного количества */}
				{showTooltip && (
					<Tooltip text='Количество ограничено' position='top' />
				)}

				{/* Селектор количества и итоговая цена */}
				<div className='flex flex-wrap justify-between items-center gap-2 w-full md:w-30 xl:w-59 p-2 md:flex-nowrap md:flex-col md:justify-normal md:items-end xl:flex-row xl:items-start xl:justify-end'>
					{/* Селектор количества (скрыт для товаров без наличия) */}
					{!isOutOfStock && (
						<QuantitySelector
							quantity={quantity}
							isUpdating={isUpdating}
							isOutOfStock={isOutOfStock}
							onDecrement={() =>
								handleQuantityChange(quantity - 1)
							}
							onIncrement={() =>
								handleQuantityChange(quantity + 1)
							}
						/>
					)}

					{/* Итоговая стоимость или "Нет в наличии" */}
					<div
						className={`text-sm md:text-lg font-bold text-right ${isOutOfStock ? 'w-full flex justify-end' : 'w-26'}`}
					>
						{isOutOfStock ? (
							<span className='font-normal md:text-base flex'>
								Нет в наличии
							</span>
						) : (
							<>
								<p>{formatPrice(totalFinalPrice)} ₽</p>
								{/* Старая цена и экономия (только на мобильных) */}
								{hasDiscount && (
									<div className='flex flex-row gap-x-2 md:hidden'>
										<p className='line-through font-normal text-xs md:text-base text-[#bfbfbf]'>
											{formatPrice(totalPriceWithoutCard)}{' '}
											₽
										</p>
										<p className='font-normal text-xs text-[#ff6633]'>
											{formatPrice(
												totalFinalPrice -
													totalPriceWithoutCard,
											)}{' '}
											₽
										</p>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
})

export default CartItem
