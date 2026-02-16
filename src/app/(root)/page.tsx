import { Loader } from '@/components/features/common/loader'
import Actions from '@/components/features/first_page/actions/Actions'
import NewProducts from '@/components/features/first_page/new_products/NewProducts'
import Purchases from '@/components/features/first_page/purchases/Purchases'
import SpecialOffers from '@/components/features/first_page/SpacialOffers'
import Slider from '@/components/features/slider/Slider'
import { Suspense } from 'react'

export default function Home() {
	return (
		<div className='w-full mx-auto'>
			<Suspense fallback={<Loader text='слайдера' />}>
				<Slider />
			</Suspense>
			<Actions />
			<NewProducts />
			<Purchases />
			<SpecialOffers />
		</div>
	)
}
