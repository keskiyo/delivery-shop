import Container from '@/components/ui/container'
import database from '@/data/database.json'
import { ChevronRight } from 'lucide-react'
import ProductCard from '../../common/ProductCard'

const Actions = () => {
	const actionProducts = database.products.filter(p =>
		p.categories.includes('actions'),
	)

	return (
		<section className='pb-8 md:pb-16 xl:pb-20'>
			<Container>
				<div className='mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between'>
					<h2 className='text-2xl xl:text-4xl text-left font-bold'>
						Акции
					</h2>
					<button className='flex flex-row items-center gap-x-2 cursor-pointer'>
						<p className='text-base text-center'>Все акции</p>
						<ChevronRight size={24} />
					</button>
				</div>
				<ul className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center'>
					{actionProducts.slice(0, 4).map((item, index) => (
						<li
							key={item.id}
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
