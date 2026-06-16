'use client'

import ErrorComponent from '@/components/features/common/ErrorComponent'
import StarRating from '@/components/shared/StarRating'
import { useCallback, useEffect, useState } from 'react'
import UserAvatar from './UserAvatar'

interface Review {
	_id: string
	userId: string
	rating: number
	comment: string
	createdAt: string
	updatedAt: string
	userName: string
	userGender?: string
	hasAvatar?: boolean
}

interface ReviewsResponse {
	reviews: Review[]
	total: number
	hasMore: boolean
}

interface ProductReviewsProps {
	productId: string
	refreshKey?: number
}

const ProductReviews = ({ productId, refreshKey = 0 }: ProductReviewsProps) => {
	const [reviews, setReviews] = useState<Review[]>([])
	const [total, setTotal] = useState(0)
	const [hasMore, setHasMore] = useState(false)
	const [displayCount, setDisplayCount] = useState(5)
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [error, setError] = useState<{
		error: Error
		userMessage: string
	} | null>(null)

	const fetchReviews = useCallback(async (
		limit: number = 5,
		skip: number = 0,
		append: boolean = false,
	) => {
		try {
			if (append) {
				setLoadingMore(true)
			} else {
				setLoading(true)
			}

			const response = await fetch(
				`/api/products/${productId}/reviews?limit=${limit}&skip=${skip}`,
			)

			if (!response.ok) {
				throw new Error('Не удалось загрузить отзывы')
			}

			const data: ReviewsResponse = await response.json()

			if (append) {
				setReviews(prev => [...prev, ...data.reviews])
			} else {
				setReviews(data.reviews)
			}

			setTotal(data.total)
			setHasMore(data.hasMore)
			setDisplayCount(skip + data.reviews.length)
		} catch (error) {
			setError({
				error:
					error instanceof Error
						? error
						: new Error('Неизвестная ошибка'),
				userMessage: 'Не удалось загрузить отзывы',
			})
		} finally {
			setLoading(false)
			setLoadingMore(false)
		}
	}, [productId])

	const handleLoadMore = () => {
		fetchReviews(5, reviews.length, true)
	}

	const handleShowLess = () => {
		const newCount = Math.max(5, displayCount - 5)
		setDisplayCount(newCount)
		setReviews(prev => prev.slice(0, newCount))
		setHasMore(newCount < total)
	}

	useEffect(() => {
		fetchReviews()
	}, [fetchReviews, refreshKey])

	if (loading) {
		return (
			<div>
				<h2 className='text-xl font-semibold mb-4'>Отзывы</h2>
				<div className='animate-pulse space-y-4'>
					{[...Array(3)].map((_, i) => (
						<div key={i} className='p-4 bg-surface rounded-lg'>
							<div className='flex items-center gap-2 mb-2'>
								<div className='rounded-full bg-muted w-9 h-9'></div>
								<div className='h-4 bg-muted rounded w-1/4'></div>
							</div>
							<div className='h-4 bg-muted rounded w-1/3 mb-4'></div>
							<div className='h-3 bg-muted rounded w-full mb-1'></div>
							<div className='h-3 bg-muted rounded w-2/3'></div>
						</div>
					))}
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<ErrorComponent
				error={error.error}
				userMessage={error.userMessage}
			/>
		)
	}

	return (
		<div>
			<h2 className='text-xl font-bold mb-4'>Отзывы</h2>

			{reviews.length === 0 ? (
				<p className='text-base text-muted-foreground'>
					Пока нет отзывов. Будьте первым!
				</p>
			) : (
				<div className='flex flex-col gap-y-10'>
					{reviews.map(review => {
						const userName =
							review.userName || 'Неизвестный пользователь'
						return (
							<div key={review._id}>
								<div className='flex items-center gap-2 mb-2'>
									<UserAvatar
										userId={review.userId}
										userGender={review.userGender}
										hasAvatar={review.hasAvatar}
										size={36}
									/>
									<span className='text-lg font-medium'>
										{userName}
									</span>
								</div>

								<div className='flex flex-row items-center gap-x-4 mb-2'>
									<StarRating rating={review.rating} />
									<span className='text-xs text-muted-foreground'>
										{new Date(
											review.createdAt,
										).toLocaleDateString('ru-RU')}
									</span>
								</div>
								<p className='text-base'>{review.comment}</p>
							</div>
						)
					})}
				</div>
			)}

			{reviews.length > 0 && (
				<div className='flex flex-col items-center gap-2 my-6'>
					<p className='text-sm text-muted-foreground'>
						Показано {displayCount} из {total} отзывов
					</p>

					{hasMore ? (
						<button
							onClick={handleLoadMore}
							disabled={loadingMore}
							className='px-6 py-2 bg-promo text-white rounded hover:shadow-(--shadow-article)  transition-custom disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{loadingMore ? 'Загрузка...' : 'Показать еще'}
						</button>
					) : displayCount > 5 ? (
						<button
							onClick={handleShowLess}
							className='px-6 py-2 bg-surface text-text-soft rounded hover:bg-surface-hover  transition-custom'
						>
							Показать меньше
						</button>
					) : null}
				</div>
			)}
		</div>
	)
}

export default ProductReviews
