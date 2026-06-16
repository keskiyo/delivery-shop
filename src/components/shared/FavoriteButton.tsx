'use client'

import IconHeart from '@/components/svg/IconHeart'
import { useFavorites } from '@/hooks/useFavorite'
import { showPromiseToast, showToast } from '@/lib/showToast'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const FavoriteButton = ({
	productId,
	variant,
}: {
	productId: string
	variant?: 'default' | 'orange' | 'onProductPage'
}) => {
	const { isAuth } = useAuthStore()
	const [isProcessing, setIsProcessing] = useState(false)
	const { toggleFavorite, isFavorite, isLoading } = useFavorites()
	const router = useRouter()

	const handleClick = async () => {
		if (!isAuth) {
			showToast({
				type: 'error',
				message:
					'Войдите в аккаунт, чтобы добавлять товары в избранное',
			})
			router.push('/login')
			return
		}

		setIsProcessing(true)

		try {
			const wasFavorite = isFavorite(productId)
			await showPromiseToast(toggleFavorite(productId), {
				pending: 'Обновляем избранное...',
				success: wasFavorite
					? 'Товар удален из избранного'
					: 'Товар добавлен в избранное',
				error: 'Не удалось обновить избранное',
			})
		} catch (error) {
			console.error('Не удалось переключить избранное:', error)
		} finally {
			setIsProcessing(false)
		}
	}

	const isActive = isAuth && isFavorite(productId)
	const disabled = isLoading || isProcessing

	const getButtonClasses = () => {
		const baseClasses = `flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`

		if (variant === 'onProductPage') {
			return `${baseClasses} w-auto h-6`
		}

		return `${baseClasses} w-8 h-8 p-2 bg-surface hover:bg-promo-soft absolute top-2 right-2 rounded transition-custom z-10 hover:scale-110`
	}

	return (
		<button
			onClick={handleClick}
			disabled={disabled}
			className={getButtonClasses()}
			title={isActive ? 'Удалить из избранного' : 'Добавить в избранное'}
		>
			<IconHeart isActive={isActive} />
			{variant === 'onProductPage' && (
				<p className='text-sm select-none ml-2'>В избранное</p>
			)}
		</button>
	)
}

export default FavoriteButton
