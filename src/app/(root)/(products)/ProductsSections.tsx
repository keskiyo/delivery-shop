import ProductCard from '@/components/shared/ProductCard'
import ViewAllLink from '@/components/shared/ViewAllLink'
import { ProductsSectionsProps } from '@/types/productsSections'

const ProductsSections = ({
	title,
	viewAllLink,
	products,
	applyIndexStyles = true,
	contentType,
	mobileItemsLimit = 4,
}: ProductsSectionsProps & {
	applyIndexStyles?: boolean
	contentType?: string
}) => {
	const gridClasses =
		contentType === 'category'
			? 'grid-cols-2 md:grid-cols-3'
			: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'

	return (
		<section>
			<div className='flex flex-col px-[max(12px,calc((100%-1208px)/2))]'>
				<div className='mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between'>
					<h2 className='text-2xl xl:text-4xl text-left font-bold'>
						{title}
					</h2>
					{viewAllLink && (
						<ViewAllLink
							href={viewAllLink.href}
							btnText={viewAllLink.text}
						/>
					)}
				</div>
				{products && products.length > 0 ? (
					<ul
						className={`grid ${gridClasses} gap-4 md:gap-6 xl:gap-10 justify-items-center`}
					>
						{products.map((item, index) => (
							<li
								key={item._id}
								className={
									applyIndexStyles
										? `${index >= mobileItemsLimit ? 'hidden md:block' : ''}
										${index >= 3 ? 'md:hidden xl:block' : ''} 
										${index >= 4 ? 'xl:hidden' : ''}`
										: ''
								}
							>
								<ProductCard {...item} />
							</li>
						))}
					</ul>
				) : (
					<div className='flex justify-center items-center min-h-100 min-w-200'>
						<span> Нет товаров</span>
					</div>
				)}
			</div>
		</section>
	)
}

export default ProductsSections
