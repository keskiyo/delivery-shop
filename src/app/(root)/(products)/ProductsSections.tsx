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
	isOrderPage,
	isAdminOrderPage,
	compact = true,
}: ProductsSectionsProps & {
	applyIndexStyles?: boolean
	contentType?: string
	isOrderPage?: boolean
	isAdminOrderPage?: boolean
}) => {
	const gridClasses =
		contentType === 'category'
			? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
			: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
	const contentWrapperClass =
		contentType === 'category'
			? 'flex min-w-0 flex-col'
			: 'flex flex-col px-[max(12px,calc((100%_-_1208px)/2))]'
	const itemBaseClass =
		contentType === 'category'
			? 'w-full max-w-52 md:max-w-56 2xl:max-w-60'
			: 'w-full'

	return (
		<section className='w-full min-w-0'>
			<div className={contentWrapperClass}>
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
								className={`${itemBaseClass} ${
									applyIndexStyles
										? `${index >= mobileItemsLimit ? 'hidden md:block' : ''}
										${index >= 3 ? 'md:hidden xl:block' : ''}
										${index >= 4 ? 'xl:hidden' : ''}`
										: ''
								}`}
							>
								<ProductCard
									{...item}
									isOrderPage={isOrderPage}
									isAdminOrderPage={isAdminOrderPage}
									isCompactView={
										compact || contentType === 'category'
									}
								/>
							</li>
						))}
					</ul>
				) : (
					<div className='flex w-full min-h-100 items-center justify-center'>
						<span> Нет товаров</span>
					</div>
				)}
			</div>
		</section>
	)
}

export default ProductsSections
