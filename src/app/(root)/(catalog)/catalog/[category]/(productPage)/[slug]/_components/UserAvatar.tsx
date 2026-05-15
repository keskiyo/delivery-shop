'use client'

import { Loader } from '@/components/features/common/loader'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getAvatarByGender } from '../../../../../../../../../utils/getAvatar'

interface UserAvatarProps {
	userId: string
	userGender?: string
	hasAvatar?: boolean
	size?: number
}

const UserAvatar = ({
	userId,
	userGender,
	hasAvatar = false,
	size = 36,
}: UserAvatarProps) => {
	const [avatarSrc, setAvatarSrc] = useState<string>('')
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Определяем источник аватара
		if (hasAvatar) {
			setAvatarSrc(`/api/auth/avatar/${userId}?t=${Date.now()}`)
		} else {
			setAvatarSrc(getAvatarByGender(userGender || 'male'))
		}
		setIsLoading(false)
	}, [userId, userGender, hasAvatar])

	const handleError = () => {
		setAvatarSrc(getAvatarByGender(userGender || 'male'))
	}

	if (isLoading) {
		return <Loader />
	}

	return (
		<div
			className='rounded-full border border-[#f3f2f1] overflow-hidden shrink-0'
			style={{ width: size, height: size }}
		>
			<Image
				src={avatarSrc}
				alt='Аватар пользователя'
				width={size}
				height={size}
				onError={handleError}
				className='object-cover'
			/>
		</div>
	)
}

export default UserAvatar
