'use client'

/**
 * Иконка сердца (избранное)
 *
 * Использует иконку Heart из lucide-react
 *
 * Параметры:
 * - isActive: активно ли (заполненное/контурное сердце)
 * - variant: 'default' или 'orange'
 *
 * Логика:
 * - Неактивный: приглушенный цвет, без заливки
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
			? 'var(--promo)'
			: 'var(--danger)'
		: 'var(--text-soft)'
	return (
		<Heart
			size={24}
			fill={isActive ? iconColor : 'none'}
			className={`transition-all duration-300 ${
				isActive
					? variant === 'orange'
						? 'text-promo'
						: 'text-danger'
					: 'text-site-chrome-muted'
			}`}
		/>
	)
}

export default IconHeart
