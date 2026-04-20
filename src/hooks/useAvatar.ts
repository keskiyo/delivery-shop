'use client'

import { useAuthStore } from '@/store/authStore'
import { useCallback, useEffect, useState } from 'react'
import { getAvatarByGender } from '../../utils/getAvatar'

interface UseAvatarProps {
	userId?: string
	gender?: string
}

/**
 * Хук для управления аватаром пользователя
 * Загружает аватар из API или использует дефолтный по полу
 * Предоставляет функционал загрузки нового аватара
 * 
 * @param userId - ID пользователя для загрузки аватара
 * @param gender - Пол пользователя для дефолтного аватара ('male' | 'female')
 * @returns Объект с URL аватара, состоянием загрузки и методами управления
 * 
 * @example
 * const { displayAvatar, uploadAvatar, isLoading } = useAvatar({ 
 *   userId: user.id, 
 *   gender: user.gender 
 * })
 * 
 * // Загрузить новый аватар
 * await uploadAvatar(file)
 */
const useAvatar = ({ userId, gender = 'male' }: UseAvatarProps) => {
	const [currentAvatar, setCurrentAvatar] = useState<string>('')
	const [isLoading, setIsLoading] = useState(false)
	const { fetchUserData } = useAuthStore()

	const getDisplayAvatar = useCallback(() => {
		return currentAvatar || getAvatarByGender(gender)
	}, [currentAvatar, gender])

	const loadAvatar = useCallback(async () => {
		if (!userId) {
			setCurrentAvatar(getAvatarByGender(gender))
			return
		}

		setIsLoading(true)

		try {
			const response = await fetch(
				`/api/auth/avatar/${userId}?t=${Date.now()}`,
			)

			if (response.ok) {
				const blob = await response.blob()

				if (blob.size > 0) {
					const avatarUrl = URL.createObjectURL(blob)
					setCurrentAvatar(avatarUrl)
					return
				}
			}

			setCurrentAvatar(getAvatarByGender(gender))
		} catch (error) {
			console.error('Error loading avatar:', error)
			setCurrentAvatar(getAvatarByGender(gender))
		} finally {
			setIsLoading(false)
		}
	}, [gender, userId])

	useEffect(() => {
		loadAvatar()
	}, [loadAvatar])

	useEffect(() => {
		return () => {
			if (currentAvatar && currentAvatar.startsWith('blob:')) {
				URL.revokeObjectURL(currentAvatar)
			}
		}
	}, [currentAvatar])

	const uploadAvatar = useCallback(
		async (file: File) => {
			if (!userId) {
				throw new Error('Нужен идентификатор пользователя')
			}

			if (!file.type.startsWith('image/')) {
				throw new Error('Пожалуйста, выберите изображение')
			}

			if (file.size > 5 * 1024 * 1024) {
				throw new Error('Размер файла не должен превышать 5MB')
			}

			setIsLoading(true)

			try {
				const formData = new FormData()
				formData.append('avatar', file)
				formData.append('userId', userId)

				const response = await fetch('/api/auth/upload-avatar', {
					method: 'POST',
					body: formData,
				})

				if (!response.ok) {
					const errorData = await response.json()
					throw new Error(errorData.error || 'Ошибка загрузки')
				}

				await loadAvatar()
				await fetchUserData()

				return true
			} catch (error) {
				console.error('Error uploading avatar:', error)
				throw error
			} finally {
				setIsLoading(false)
			}
		},
		[fetchUserData, loadAvatar, userId],
	)

	return {
		avatar: currentAvatar,
		displayAvatar: getDisplayAvatar(),
		isLoading,
		loadAvatar,
		uploadAvatar,
		getDisplayAvatar,
	}
}

export default useAvatar
