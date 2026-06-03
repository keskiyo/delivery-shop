'use client'


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
