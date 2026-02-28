import ProductCard from '@/components/shared/ProductCard'
import ViewAllLink from '@/components/shared/ViewAllLink'
import { ProductsSectionsProps } from '@/types/productsSections'

const ProductsSections = ({
	title,
	viewAllLink,
	products,
}: ProductsSectionsProps) => {
	return (
		<section>
			<div className='flex flex-col px-[max(12px,calc((100%-1208px)/2))] mt-20'>
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
				<ul className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center'>
					{products.map(item => (
						<li key={item._id}>
							<ProductCard {...item} />
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}

export default ProductsSections
