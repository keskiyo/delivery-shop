'use client'

import IconHeart from '@/components/svg/IconHeart'
import { useFavorites } from '@/hooks/useFavorite'
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
			router.push('/login')
			return
		}

		setIsProcessing(true)

		try {
			await toggleFavorite(productId)
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

		return `${baseClasses} w-8 h-8 p-2 bg-[#f3f2f1] hover:bg-[#fcd5ba] absolute top-2 right-2 rounded duration-300 z-10 hover:scale-110`
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
