import AddToCartButton from '@/components/shared/AddToCartButton'
import FavoriteButton from '@/components/shared/FavoriteButton'
import StarRating from '@/components/shared/StarRating'
import IconCart from '@/components/svg/iconCart'
import { ProductCardProps } from '@/types/product'
import Image from 'next/image'
import Link from 'next/link'
import { CONFIG } from '../../../config/config'
import {
	calculateFinalPrice,
	calculatePriceByCard,
} from '../../../utils/calcPrices'
import { formatPrice } from '../../../utils/formatPrice'
import { TRANSLATIONS } from '../../../utils/translations'

const cardDiscountPercent = CONFIG.CARD_DISCOUNT_PERCENT


const ProductCard = ({
	id,
	img,
	title,
	description,
	basePrice,
	discountPercent = 0,
	rating,
	categories,
	quantity,
	orderQuantity,
	isLowStock,
	insufficientStock,
	isOrderPage = false,
	index = 0,
	isAdminOrderPage,
}: ProductCardProps) => {
	const finalPrice = calculateFinalPrice(basePrice, discountPercent)

	const priceByCard = calculatePriceByCard(finalPrice, cardDiscountPercent)

	const showTwoPrices =
		!isOrderPage && discountPercent > 0 && cardDiscountPercent > 0

	const displayPrice = showTwoPrices ? priceByCard : finalPrice

	const productId = id
	const mainCategory = categories?.[0]

	const productUrl = `/catalog/${encodeURIComponent(mainCategory)}/${productId}`

	const isPriorityImage = index < 4
	const productTitle = title?.trim() || description?.trim() || 'Товар'

	return (
		<div
			className={`relative flex w-40 flex-col justify-between overflow-hidden rounded bg-card align-top duration-300 hover:shadow-article md:w-56 xl:w-68 ${isAdminOrderPage ? 'h-auto' : 'min-h-87.25'} p-0`}
		>
			{orderQuantity && (
				<div className='absolute top-2 left-2 flex items-center p-1 bg-surface/90 rounded justify-center gap-1 text-lg font-bold z-10 text-text-soft'>
					<IconCart />
					{orderQuantity}
				</div>
			)}

			{(isLowStock || insufficientStock) && (
				<div
					className={`absolute top-3 left-1/2 transform -translate-x-1/2 p-1 rounded text-[10px] md:px-2 md:text-xs z-10 ${
						insufficientStock
							? 'bg-danger text-white'
							: 'bg-promo text-white'
					}`}
				>
					{insufficientStock
						? 'Нет в наличии'
						: `Осталось: ${quantity}`}
				</div>
			)}
			{!isAdminOrderPage && (
				<FavoriteButton productId={productId.toString()} />
			)}
			<Link
				href={productUrl}
				className='block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
				aria-label={`Открыть товар ${productTitle}`}
			>
				<div className='w-40 h-40 md:w-56 xl:w-68 aspect-square relative bg-white'>
					<Image
						src={img}
						alt={productTitle}
						fill
						className='object-contain p-2'
						priority={isPriorityImage}
						sizes='(max-width: 768px) 160px, (max-width: 1200px) 224px, 272px'
						unoptimized
					/>
					{!isAdminOrderPage &&
						!isOrderPage &&
						discountPercent > 0 && (
							<div className='absolute bg-promo py-1 px-2 rounded text-white bottom-2 left-2'>
								-{discountPercent}%
							</div>
						)}
				</div>

				<div
					className={`flex flex-col bg-card p-2 ${isAdminOrderPage ? 'h-auto' : 'min-h-47.25'} `}
				>
					{!isAdminOrderPage && (
						<div className='flex flex-row justify-between items-start h-11.25'>
							<div className='flex flex-col gap-x-1'>
								<div className='flex flex-row gap-x-1 text-sm md:text-lg font-bold'>
									<span>{formatPrice(displayPrice)}</span>
									<span>₽</span>
								</div>
								{showTwoPrices && (
									<p className='text-muted-foreground text-[10px] md:text-xs'>
										С картой
									</p>
								)}
							</div>
							{showTwoPrices && (
								<div className='flex flex-col gap-x-1'>
									<div className='flex flex-row gap-x-1 text-xs md:text-base'>
										<span>{formatPrice(finalPrice)}</span>
										<span>₽</span>
									</div>
									<p className='text-muted-foreground text-[10px] md:text-xs text-right'>
										Обычная
									</p>
								</div>
							)}
						</div>
					)}
					{isAdminOrderPage && (
						<div className='text-xs mb-2'>
							{TRANSLATIONS[categories[0]]}
						</div>
					)}
					<div
						className='min-h-13.5 text-xs leading-normal md:text-base'
						title={productTitle}
					>
						<span className='line-clamp-3 md:line-clamp-2'>
							{description}
						</span>
					</div>
					{!isAdminOrderPage && (
						<StarRating rating={rating?.rate || 5.0} />
					)}
				</div>
			</Link>
			{!isAdminOrderPage && (
				<AddToCartButton
					productId={productId.toString()}
					availableQuantity={quantity}
				/>
			)}
		</div>
	)
}

export default ProductCard
