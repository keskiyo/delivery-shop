'use client'

/**
 * Иконка сердца (избранное)
 *
 * Использует иконку Heart из lucide-react
 *
 * Параметры:
 * - isActive: активно ли (заполненное/контурное сердце)
 * - variant: 'default' (красный #ff3b30) или 'orange' (оранжевый #ff6633)
 *
 * Логика:
 * - Неактивный: серый цвет (#808080), без заливки
 * - Активный (default): красный с заливкой
 * - Активный (orange): оранжевый с заливкой
 *
 * Применение:
 * - FavoriteButton.tsx (кнопка избранного)
 * - TopMenu.tsx (иконка в меню)
 */
import { Heart } from 'lucide-react'

interface HeartIconProps {
	isActive?: boolean
	variant?: 'default' | 'orange'
}

const IconHeart = ({ isActive, variant }: HeartIconProps) => {
	const iconColor = isActive
		? variant === 'orange'
			? '#ff6633'
			: '#ff3b30'
		: '#808080'
	return (
		<Heart
			size={24}
			color={iconColor}
			fill={isActive ? iconColor : 'none'}
			className='transition-all duration-300'
		/>
	)
}

export default IconHeart
