import Image from 'next/image'
import { memo } from 'react'

interface ProductImageProps {
	productId: string
	title: string
}

const ProductImage = memo(function ProductImage({
	productId,
	title,
}: ProductImageProps) {
	return (
		<div className='shrink-0 w-20 h-17 min-w-20 min-h-17 bg-gray-100 rounded flex items-center justify-center shadow-cart-item relative mt-3'>
			<Image
				src={`/images/products/img-${productId}.jpeg`}
				alt={title}
				width={80}
				height={68}
				className='object-cover rounded w-full h-full shrink-0'
			/>
		</div>
	)
})

export default ProductImage
