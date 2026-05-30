import { ProductCardProps } from '@/types/product'
import Image from 'next/image'
import Link from 'next/link'

interface SimilarProductsProps {
	currentProduct: ProductCardProps
}

interface SimilarProduct {
	id: string
	title: string
	img: string
	basePrice: number
	discountPercent: number
	categories: string[]
}

const SimilarProducts = async ({ currentProduct }: SimilarProductsProps) => {
	const category = currentProduct.categories[0]

	if (!category) return null

	let similarProducts: SimilarProduct[]

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/similar-products?productId=${currentProduct.id}&category=${category}&limit=4`,
			{
				next: { revalidate: 3600 },
			},
		)

		if (!response.ok) {
			throw new Error('Не удалось получить похожие продукты')
		}

		const data = await response.json()
		similarProducts = data.similarProducts.slice(0, 3)
	} catch (error) {
		console.error('Error fetching similar products:', error)
		return null
	}

	if (similarProducts.length === 0) {
		return null
	}

	const calculatePrice = (product: SimilarProduct) => {
		const discount = product.basePrice * (product.discountPercent / 100)
		return product.basePrice - discount
	}

	return (
		<div className='mx-auto flex flex-col items-center'>
			<div className='w-full max-w-82 md:max-w-172 xl:max-w-42'>
				<h3 className='text-sm md:text-lg font-semibold mb-2 text-left'>
					Похожие
				</h3>
			</div>

			<div className='flex flex-row xl:flex-col gap-2 md:gap-4 justify-center xl:justify-start'>
				{similarProducts.map(product => (
					<Link
						key={product.id}
						href={`/catalog/product/${product.id}`}
						className='text-sm md:text-lg flex flex-col w-19.5 md:w-43 xl:w-42 rounded bg-card shadow-image-block duration-300 hover:shadow-lg overflow-hidden'
						title={product.title}
					>
						<div className='relative w-full h-6.25 md:h-27.75 xl:h-15 shrink-0 bg-white'>
							<Image
								src={product.img}
								alt={product.title}
								fill
								className='object-contain rounded p-1'
								sizes='(max-width: 768px) 78px, (max-width: 1280px) 172px, 168px'
							/>
						</div>
						<div className='flex flex-col gap-1 p-2 text-foreground'>
							<div className='text-[10px] md:text-sm leading-tight line-clamp-2'>
								{product.title}
							</div>
							<div className='font-bold text-sm md:text-base'>
								{calculatePrice(product)} ₽
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}

export default SimilarProducts
