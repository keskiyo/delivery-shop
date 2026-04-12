'use client'

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
		: '#606060'
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
