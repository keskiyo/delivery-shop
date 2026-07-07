'use client'

import { ProductCardProps } from '@/types/product'
import Image from 'next/image'
import { useState } from 'react'

type ProductWithImages = ProductCardProps & {
	images?: string[]
}

const ImagesBlock = ({ product }: { product: ProductWithImages }) => {
	const images =
		product.images && product.images.length > 0
			? product.images
			: [product.img, product.img, product.img, product.img]

	const [activeIndex, setActiveIndex] = useState(0)

	const activeImage = images[activeIndex] || product.img

	return (
		<div className='flex flex-row gap-x-4 h-62 xl:h-124 justify-center'>
						<div className='flex flex-col gap-y-2 shrink-0'>
				{images.map((src, index) => (
					<button
						key={`${src}-${index}`}
						type='button'
						onClick={() => setActiveIndex(index)}
						aria-label={`Показать изображение ${index + 1}`}
						className={`relative h-16 w-16 overflow-hidden bg-white transition md:h-20 md:w-20 cursor-pointer ${
							activeIndex === index
								? 'border-2 border-promo'
								: 'border border-transparent hover:border-border'
						}`}
					>
						<Image
							src={src}
							alt={`${product.title} - миниатюра ${index + 1}`}
							fill
							className='object-contain p-1'
							sizes='80px'
						/>
					</button>
				))}
			</div>

						<div
				className='relative flex justify-center items-center shadow-image-block bg-white h-62 xl:h-120 w-62 md:w-68 xl:w-120 p-2 shrink-0'
			>
				<Image
					src={activeImage}
					alt={product.title}
					fill
					className='object-contain p-2'
					sizes='(max-width: 768px) 248px, (max-width: 1032px) 272px, 504px'
					priority
				/>
				{product.discountPercent && product.discountPercent > 0 ? (
					<div className='absolute top-5 right-5 bg-promo text-white px-2 py-1 rounded text-sm'>
						-{product.discountPercent}%
					</div>
				) : null}
			</div>
		</div>
	)
}

export default ImagesBlock
