'use client'

import dynamic from 'next/dynamic'

const NotFoundContent = dynamic(
	() => import('@/components/shared/NotFoundContent'),
	{
		ssr: false,
	},
)

export default function NotFoundWrapper() {
	return (
		<div className='fixed insert-0 z-50 bg-background w-full'>
			<NotFoundContent />
		</div>
	)
}
