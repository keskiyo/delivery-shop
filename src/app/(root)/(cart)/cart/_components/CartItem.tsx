'use client'

import Tooltip from '@/app/(root)/(auth)/_components/Tooltip'
import CartSkeletons from '@/app/(root)/(cart)/cart/_components/CartSkeleton'
import DiscountBadge from '@/app/(root)/(cart)/cart/_components/DiscountBadge'
import PriceDisplay from '@/app/(root)/(cart)/cart/_components/PriceDisplay'
import ProductImage from '@/app/(root)/(cart)/cart/_components/ProductImage'
import QuantitySelector from '@/app/(root)/(cart)/cart/_components/QuantitySelector'
import SelectionCheckbox from '@/app/(root)/(cart)/cart/_components/SelectionCheckbox'
import { CartItemProps } from '@/types/cart'
import Link from 'next/link'
import { memo, useState } from 'react'
import { CONFIG } from '../../../../../../config/config'
import {
	calculateFinalPrice,
	calculatePriceByCard,
} from '../../../../../../utils/calcPrices'
import { formatPrice } from '../../../../../../utils/formatPrice'

const CartItem = memo(function CartItem({
	item,
	productData,
	isSelected,
	onSelectionChange,
	onQuantityUpdate,
	hasLoyaltyCard,
}: CartItemProps) {
	const [quantity, setQuantity] = useState(item.quantity)
	const [isUpdating, setIsUpdating] = useState(false)
	const [showTooltip, setShowTooltip] = useState(false)

	const handleQuantityChange = async (newQuantity: number) => {
		if (newQuantity < 0) return
		if (!productData) return

		const maxQuantity = productData.quantity

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
			setQuantity(previousQuantity)
		} finally {
			setIsUpdating(false)
		}
	}

	if (!productData) {
		return <CartSkeletons />
	}

	const priceWithDiscount = calculateFinalPrice(
		productData?.basePrice || 0,
		productData?.discountPercent || 0,
	)

	const finalPrice = hasLoyaltyCard
		? calculatePriceByCard(priceWithDiscount, CONFIG.CARD_DISCOUNT_PERCENT)
		: priceWithDiscount

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
			<SelectionCheckbox
				isSelected={isSelected}
				onSelectionChange={checked =>
					onSelectionChange(item.productId, checked)
				}
			/>
			<div className='flex flex-row flex-wrap md:flex-row justify-between w-full md:flex-nowrap'>
				<div className='flex flex-row flex-wrap md:flex-nowrap'>
					<ProductImage
						productId={item.productId}
						title={productData.title}
					/>

					<div className='flex-1 flex min-w-56 md:flex-initial flex-col gap-y-2 p-2'>
						<Link
							className='text-base hover:text-[#ff6633] cursor-pointer'
							href={`/catalog/${productData.categories[0]}/${item.productId}`}
						>
							{productData.description}
						</Link>

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

				{showTooltip && (
					<Tooltip text='Количество ограничено' position='top' />
				)}
				<div className='flex flex-wrap justify-between items-center gap-2 w-full md:w-30 xl:w-59 p-2 md:flex-nowrap md:flex-col md:justify-normal md:items-end xl:flex-row xl:items-start xl:justify-end'>
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
