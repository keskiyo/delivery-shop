'use client'

import AddReviewForm from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[slug]/_components/AddReviewForm'
import ProductReviews from '@/app/(root)/(catalog)/catalog/[category]/(productPage)/[slug]/_components/ProductReviews'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ReviewsWrapperProps {
	productId: string
}

/**
 * Компонент-обертка для отзывов и формы добавления отзыва
 *
 * Функционал:
 * - Отображает список отзывов о товаре
 * - Форма добавления нового отзыва
 * - Обновление списка отзывов после добавления нового
 * - Сохранение позиции скролла при обновлении
 *
 * Логика работы:
 * 1. ProductReviews показывает существующие отзывы
 * 2. AddReviewForm позволяет добавить новый отзыв
 * 3. После успешного добавления отзыва:
 *    - Сохраняется текущая позиция скролла
 *    - Увеличивается refreshKey для перерендера ProductReviews
 *    - Вызывается router.refresh() для обновления серверных данных
 *    - Восстанавливается позиция скролла через 100мс
 *
 * Особенности:
 * - refreshKey используется как key для ProductReviews для принудительного обновления
 * - Сохранение скролла предотвращает прыжок страницы вверх
 * - Таймаут 100мс дает время на рендер перед восстановлением скролла
 *
 * Используется в:
 * - ProductPageContent - страница товара
 *
 * @param productId - ID товара для отображения отзывов
 */
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
