import AdditionalInfo from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/AdditionalInfo'
import Bonuses from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/Bonuses'
import CartButton from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/CartButton'
import ImagesBlock from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/ImagesBlock'
import ProductOffer from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/ProductOffer'
import RatingDistribution from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/RatingDistribution'
import ReviewsWrapper from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/ReviewsWrapper'
import SameBrandProducts from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/SameBrandProducts'
import ShareButton from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/ShareButton'
import SimilarProducts from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/SimilarProducts'
import Actions from '@/app/(root)/(products)/Actions'
import StarRating from '@/components/shared/StarRating'
import { ProductCardProps } from '@/types/product'
import { Heart } from 'lucide-react'
import { CONFIG } from '../../../../../../../../../config/config'
import { getReviewsWord } from '../../../../../../../../../utils/reviewsWord'

const ProductPageContent = ({ product }: { product: ProductCardProps }) => {
	const discountedPrice = product.discountPercent
		? product.basePrice * (1 - product.discountPercent / 100)
		: product.basePrice

	const cardPrice = discountedPrice * (1 - CONFIG.CARD_DISCOUNT_PERCENT / 100)
	const bonusesAmount = cardPrice * 0.05

	return (
		<div className='px-[max(12px,calc((100%-1208px)/2))] md:px-[max(16px,calc((100%-1208px)/2))]'>
			<h1 className='text-2xl font-bold mb-4'>{product.description}</h1>
			<div className='flex flex-row flex-wrap items-center gap-6 mb-4 md:mb-6'>
				<div className='text-xs'>арт. {product.article}</div>
				<div className='flex flex-row flex-wrap gap-2 items-center'>
					<StarRating rating={product.rating.rate || 5} />
					<p className='text-sm underline'>
						{product.rating.count || 0}{' '}
						{getReviewsWord(product.rating.count || 0)}
					</p>
				</div>
				<ShareButton title={product.title} />
				<button className='flex flex-row flex-wrap gap-2 items-center cursor-pointer'>
					<Heart size={24} />
					<p className='text-sm'>В избранное</p>
				</button>
			</div>
			<div className='flex flex-col gap-y-25 md:gap-y-20 xl:gap-y-30'>
				<div className='flex flex-col md:flex-row md:flex-wrap gap-10 w-full justify-center'>
					<ImagesBlock product={product} />
					<div className='md:w-86 lg:w-94 flex flex-col'>
						<ProductOffer
							discountedPrice={discountedPrice}
							cardPrice={cardPrice}
						/>
						<CartButton />
						<Bonuses bonus={bonusesAmount} />
						<AdditionalInfo
							brand={product.brand}
							manufacturer={product.manufacturer}
							weight={product.weight}
						/>
					</div>
					<SimilarProducts currentProduct={product} />
				</div>
				<SameBrandProducts currentProduct={product} />
				<div>
					<h2 className='text-2xl xl:text-4xl text-left font-bold mb-4 md:mb-8 xl:mb-10'>
						Отзывы
					</h2>
					<div className='flex flex-col md:flex-row flex-wrap gap-4 md:gap-x-8 xl:gap-x-36'>
						<RatingDistribution
							averageRating={product.rating.rate}
							distribution={product.rating.distribution}
						/>
						<ReviewsWrapper productId={product.id.toString()} />
					</div>
				</div>
				<Actions limitItems={6} mobileItemsLimit={6} />
			</div>
		</div>
	)
}

export default ProductPageContent
