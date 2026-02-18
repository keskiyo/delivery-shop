import ViewAllLink from '@/components/features/common/ViewAllLink'
import Container from '@/components/ui/container'

import { ProductCardProps } from '@/types/product'
import ProductCard from '../../common/ProductCard'

const Purchases = async () => {
	let error = null
	let purchases: ProductCardProps[] = []

	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL!}/api/users/purchases`,
		)
		purchases = await res.json()
	} catch (err) {
		error = 'Ошибка получения купленных ранее продуктов'
		console.error('Ошибка получения купленных ранее продуктов', err)
	}

	if (error) {
		return <div className='text-red-600'> Ошибка: {error} </div>
	}

	return (
		<section className='pb-8 md:pb-16 xl:pb-20'>
			<Container>
				<div className='mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between'>
					<h2 className='text-2xl xl:text-4xl text-left font-bold'>
						Покупали ранее
					</h2>
					<ViewAllLink href='purchases' btnText='Прошлые покупки' />
				</div>
				<ul className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center'>
					{purchases.slice(0, 4).map((item, index) => (
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

export default Purchases
