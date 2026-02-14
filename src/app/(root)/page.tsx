import { Loader } from '@/components/features/common/loader'
import TestPage from '@/components/features/common/Test'
import Slider from '@/components/features/slider/Slider'
import { Suspense } from 'react'

export default function Home() {
	return (
		<div className='w-full mx-auto'>
			<Suspense fallback={<Loader text='слайдера' />}>
				<Slider />
			</Suspense>
			<TestPage />
		</div>
	)
}
