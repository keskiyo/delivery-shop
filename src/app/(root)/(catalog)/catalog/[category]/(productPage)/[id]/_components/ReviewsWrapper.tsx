'use client'

import AddReviewForm from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/AddReviewForm'
import ProductReviews from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[id]/_components/ProductReviews'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ReviewsWrapperProps {
	productId: string
}

const ReviewsWrapper = ({ productId }: ReviewsWrapperProps) => {
	const [refreshKey, setRefreshKey] = useState(0)
	const router = useRouter()

	const handleReviewAdded = () => {
		const scrollY = window.scrollY
		setRefreshKey(prev => prev + 1)

		router.refresh()
		setTimeout(() => window.scrollTo(0, scrollY), 100)
	}

	return (
		<div className='flex flex-col w-full md:flex-1 min-w-0'>
			<ProductReviews productId={productId} refreshKey={refreshKey} />
			<AddReviewForm
				productId={productId}
				onReviewAdded={handleReviewAdded}
			/>
		</div>
	)
}

export default ReviewsWrapper
