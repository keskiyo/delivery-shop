import ImageUploader from '@/app/(root)/(admin)/administrator/products/_components/ImageUploader'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ImageUploadSectionProps {
	onImageChange: (file: File | null) => void
	uploading: boolean
	loading: boolean
	existingImage?: string
}

const ImageUploadSection = ({
	existingImage,
	onImageChange,
	uploading,
	loading,
}: ImageUploadSectionProps) => {
	const [image, setImage] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	useEffect(() => {
		if (existingImage) {
			setPreviewUrl(existingImage)
		}
	}, [existingImage])

	const handleImageUpload = (file: File) => {
		setImage(file)
		onImageChange(file)

		const url = URL.createObjectURL(file)
		setPreviewUrl(url)
	}

	const handleRemoveImage = () => {
		setImage(null)
		onImageChange(null)

		if (previewUrl && previewUrl.startsWith('blob:')) {
			URL.revokeObjectURL(previewUrl)
		}
		setPreviewUrl(null)
	}

	return (
		<div>
			<label className='block text-sm font-medium mb-4'>
				Изображение товара <span className='text-danger'>*</span>
			</label>

			{previewUrl ? (
				<div className='mb-4 flex flex-col items-center justify-center'>
					<div className='relative w-80 h-80 inline-block'>
						<Image
							src={previewUrl}
							alt='Предпросмотр товара'
							fill
							className='object-contain rounded border-2 border-border'
						/>
						<button
							type='button'
							onClick={handleRemoveImage}
							className='absolute -top-2 -right-2 bg-danger text-white rounded-full p-1 hover:bg-danger/90 transition-colors'
							disabled={uploading || loading}
						>
							<X className='w-4 h-4 cursor-pointer' />
						</button>
					</div>
					<p className='mt-2 text-sm text-success'>
						{image ? (
							<>
								Выбрано: {image?.name} (
								{(image ? image.size / 1024 / 1024 : 0).toFixed(
									2,
								)}{' '}
								MB)
							</>
						) : (
							'Текущее изображение'
						)}
					</p>
				</div>
			) : (
				<ImageUploader onImageUploadAction={handleImageUpload} />
			)}

			{uploading && (
				<p className='mt-2 text-sm text-promo'>
					Загрузка изображения...
				</p>
			)}
		</div>
	)
}

export default ImageUploadSection
