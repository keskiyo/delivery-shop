import ViewAllLink from '@/components/features/common/ViewAllLink'
import Container from '@/components/ui/container'
import { ProductCardProps } from '@/types/product'
import { shuffleArray } from '@/utils/shuffleArray'
import ProductCard from '../../common/ProductCard'

const Actions = async () => {
	let error = null
	let products: ProductCardProps[] = []

	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL!}/api/products?categories=actions`,
		)
		products = await res.json()

		products = shuffleArray(products)
	} catch (err) {
		error = 'Ошибка получения акционных продуктов'
		console.error('Ошибка получения акционных продуктов', err)
	}

	if (error) {
		return <div className='text-red-600'> Ошибка: {error} </div>
	}

	return (
		<section className='pb-8 md:pb-16 xl:pb-20'>
			<Container>
				<div className='mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between'>
					<h2 className='text-2xl xl:text-4xl text-left font-bold'>
						Акции
					</h2>
					<ViewAllLink href='actions' btnText='Все акции' />
				</div>
				<ul className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center'>
					{products.slice(0, 4).map((item, index) => (
						<li
							key={item._id}
							className={`${index >= 4 ? 'hidden' : ''}
            ${index >= 3 ? 'md:hidden xl:block' : ''}
            ${index >= 4 ? 'xl:hidden' : ''}
            `}
						>
							<ProductCard {...item} />
						</li>
					))}
				</ul>
			</Container>
		</section>
	)
}

export default Actions
