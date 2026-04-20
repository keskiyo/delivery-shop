'use client'

import ConfirmAvatarModal from '@/app/(root)/(user-profile)/_components/ConfirmAvatarModal'
import IconAvatarChange from '@/components/svg/IconAvatarChange'
import useAvatar from '@/hooks/useAvatar'
import { useAuthStore } from '@/store/authStore'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { getAvatarByGender } from '../../../../../utils/getAvatar'
import { optimizeImage } from '../../../../../utils/optimizeImage'

/**
 * Компонент управления аватаром пользователя в профиле
 * 
 * Функционал:
 * - Отображение текущего аватара (загруженный или дефолтный по полу)
 * - Загрузка нового аватара с предпросмотром
 * - Оптимизация изображения перед загрузкой (128x128, JPEG, качество 0.7)
 * - Модальное окно подтверждения загрузки
 * - Удаление аватара (возврат к дефолтному)
 * 
 * Логика работы:
 * 1. Пользователь выбирает файл через input[type="file"]
 * 2. Изображение оптимизируется (обрезается до квадрата, масштабируется)
 * 3. Показывается модальное окно с предпросмотром
 * 4. При подтверждении загружается на сервер через uploadAvatar
 * 5. После успешной загрузки обновляется отображение
 * 
 * Оптимизация:
 * - Размер: 128x128 пикселей (квадрат)
 * - Формат: JPEG
 * - Качество: 0.7 (70%)
 * - Обрезка: центрирование по большей стороне
 * 
 * Особенности:
 * - Автоматическая очистка blob URL для предотвращения утечек памяти
 * - Обработка ошибок загрузки (fallback на дефолтный аватар)
 * - Индикатор загрузки во время upload
 * 
 * @param gender - Пол пользователя для выбора дефолтного аватара ('male' | 'female')
 */
const ProfileAvatar = ({ gender }: { gender: string }) => {
	const { user } = useAuthStore()
	const [previewUrl, setPreviewUrl] = useState<string>('')
	const [pendingFile, setPendingFile] = useState<File | null>(null)
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const {
		displayAvatar,
		isLoading: isUploading,
		uploadAvatar,
	} = useAvatar({ userId: user?.id, gender })

	useEffect(() => {
		return () => {
			if (previewUrl && previewUrl.startsWith('blob:')) {
				URL.revokeObjectURL(previewUrl)
			}
		}
	}, [previewUrl])

	const handleImageError = (
		e: React.SyntheticEvent<HTMLImageElement, Event>,
	) => {
		const target = e.target as HTMLImageElement
		target.src = getAvatarByGender(gender)
	}

	const handleFileInputChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0]
		if (!file) return

		try {
			const optimizedFile = await optimizeImage(file, 128, 0.7)

			const reader = new FileReader()

			reader.onload = event => {
				if (event.target?.result) {
					const previewUrl = event.target.result as string

					setPreviewUrl(previewUrl)
					setPendingFile(optimizedFile)
					setShowConfirmModal(true)
				}
			}
			reader.readAsDataURL(file)
		} catch (error) {
			console.error('Ошибка оптимизации изображения:', error)
			alert('Не удалось обработать изображение')
		}
	}

	const handleAvatarConfirm = async () => {
		if (pendingFile) {
			setShowConfirmModal(false)

			try {
				await uploadAvatar(pendingFile)
				if (previewUrl && previewUrl.startsWith('blob:')) {
					URL.revokeObjectURL(previewUrl)
				}
				setPreviewUrl('')
			} catch (error) {
				alert(
					error instanceof Error ? error.message : 'Ошибка загрузки',
				)
				setPreviewUrl('')
			} finally {
				setPendingFile(null)
			}
		}
	}

	const handleAvatarCancel = () => {
		setShowConfirmModal(false)
		setPendingFile(null)
		if (previewUrl && previewUrl.startsWith('blob:')) {
			URL.revokeObjectURL(previewUrl)
		}
		setPreviewUrl('')

		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	return (
		<div className='flex flex-col items-center mb-8'>
			<div className='relative'>
				<Image
					src={displayAvatar}
					unoptimized
					width={128}
					height={128}
					alt='Аватар профиля'
					className='w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover'
					onError={handleImageError}
					priority
				/>
				{isUploading && (
					<div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
					</div>
				)}
				<label className='absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-green-500 duration-300'>
					<input
						ref={fileInputRef}
						type='file'
						className='hidden'
						accept='image/jpeg,image/png,image/webp,image/gif'
						onChange={handleFileInputChange}
					/>
					<IconAvatarChange />
				</label>

				<ConfirmAvatarModal
					isOpen={showConfirmModal}
					previewUrl={previewUrl}
					isUploading={isUploading}
					onConfirm={handleAvatarConfirm}
					onCancel={handleAvatarCancel}
				/>
			</div>
			<div className='mt-3 text-center'>
				<p className='text-sm mb-1'>
					Нажмите на иконку для смены аватара
				</p>
				<p className='text-xs text-[#8f8f8f]'>
					{isUploading
						? 'Загрузка...'
						: 'Загрузите файл JPEG, PNG, WEBP, GIF'}
				</p>
			</div>
		</div>
	)
}

export default ProfileAvatar
