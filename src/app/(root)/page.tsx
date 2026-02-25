import Articles from '@/app/(root)/(articles)/Articles'
import Actions from '@/app/(root)/(products)/Actions'
import NewProducts from '@/app/(root)/(products)/NewProducts'
import Purchases from '@/app/(root)/(user)/Purchases'
import { Loader } from '@/components/features/common/loader'
import Maps from '@/components/features/Maps'
import Slider from '@/components/features/slider/Slider'
import SpecialOffers from '@/components/features/SpacialOffers'
import { Suspense } from 'react'
export const dynamic = 'force-dynamic'

export default function Home() {
	return (
		<div className='w-full mx-auto'>
			<Suspense fallback={<Loader text='слайдера' />}>
				<Slider />
			</Suspense>
			<div className='px-[max(12px,calc((100%-1208px)/2))] flex flex-col gap-y-20 md:mb-25 xl:mb-30'>
				{[
					{ component: <Actions />, text: 'акций' },
					{ component: <NewProducts />, text: 'новинок' },
					{ component: <Purchases />, text: 'ваших прошлых покупок' },
					{
						component: <SpecialOffers />,
						text: 'специальных приложений',
					},
					{ component: <Maps />, text: 'карты' },
					{ component: <Articles />, text: 'статей' },
				].map((item, index) => (
					<Suspense
						key={index}
						fallback={<Loader text={item.text} />}
					>
						{item.component}
					</Suspense>
				))}
			</div>
		</div>
	)
}
