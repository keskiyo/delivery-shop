import { Loader } from '@/components/features/common/loader'
import Slider from '@/components/features/slider/Slider'
import Actions from '@/components/layout/Actions'
import { Suspense } from 'react'

export default function Home() {
	return (
		<div className='w-full mx-auto'>
			<Suspense fallback={<Loader text='слайдера' />}>
				<Slider />
			</Suspense>
			<Actions />
		</div>
	)
}
