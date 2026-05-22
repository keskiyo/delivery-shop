import { SEO_LIMITS } from '@/app/(root)/(admin)/administrator/(cms)/cms/utils/SEO_LIMITS'
import { AlertCircle, Upload, XCircle } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'

const ImageSection = ({
	formData,
	charCount,
	isUploading,
	isSubmitting,
	onInputChange,
	onFileChange,
	onRemoveImage,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleRemoveImage = () => {
		onRemoveImage()

		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}
	return (
		<div className='mb-6 bg-card p-4 rounded border border-gray-200'>
			<h3 className='text-lg font-medium mb-4'>Изображение категории</h3>
			<div className='space-y-4'>
				{formData.image && (
					<div className='bg-gray-50 p-4 rounded border border-gray-200'>
						<div className='flex items-start gap-4'>
							<div className='shrink-0'>
								<Image
									src={formData.image}
									alt='Предпросмотр'
									width={800}
									height={450}
									className='w-full aspect-video object-cover rounded shadow-sm'
									unoptimized={formData.image.startsWith(
										'blob:',
									)}
								/>
							</div>
						</div>
						<div className='flex-1 mt-8'>
							<p className='text-sm text-[#8a8a8a] mb-2'>
								{formData.image.startsWith('blob:')
									? 'Новое изображение (будет загружено при сохранении)'
									: 'Текущее изображение категории'}
							</p>
							{formData.image.startsWith('blob:') && (
								<p className='flex items-center gap-1 text-xs text-green-600 mb-2'>
									<AlertCircle className='w-3 h-3' />
									Старое изображение будет удалено после
									сохранения
								</p>
							)}
							<button
								type='button'
								onClick={handleRemoveImage}
								disabled={isUploading || isSubmitting}
								className='flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 cursor-pointer duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 hover:border-red-300'
							>
								<XCircle className='w-4 h-4' />
								Удалить изображение
							</button>
						</div>
					</div>
				)}
				<div>
					<label className='block text-sm font-medium mb-2'>
						{'Загрузить изображение'}
						<span className='text-[#8a8a8a] text-xs ml-2'>
							(рекомендуется 800×450px, максимум 5MB)
						</span>
					</label>
					<div className='flex items-center gap-4'>
						<div className='flex-1'>
							<label className='relative cursor-pointer'>
								<input
									type='file'
									ref={fileInputRef}
									accept='image/jpeg,image/jpg,image/png,image/gif,image/webp'
									onChange={onFileChange}
									disabled={isUploading || isSubmitting}
									className='hidden'
								/>
								<div className='w-full px-3 py-2 text-sm border border-gray-300 rounded focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20 duration-300 disabled:opacity-50 disabled:bg-gray-100 hover:bg-gray-50'>
									<div className='flex items-center gap-2 text-[#8a8a8a]'>
										<Upload className='w-4 h-4' />
										<span>Выберите файл</span>
									</div>
								</div>
							</label>
						</div>
						{isUploading && (
							<div className='flex items-center gap-2 text-sm text-green-600'>
								<div className='animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent'></div>
								Обработка...
							</div>
						)}
					</div>
					<p className='text-xs text-[#8a8a8a] mt-2'>
						Поддерживаемые форматы: JPG, PNG, GIF, WebP. Изображение
						будет загружено на сервер только при сохранении
						категории.
					</p>
				</div>
				{formData.image && (
					<div>
						<div className='flex justify-between items-center mb-1'>
							<label className='block text-sm font-medium'>
								Описание изображения (ALT текст)
							</label>
							<span
								className={`text-xs ${
									charCount.slug > SEO_LIMITS.slug.max
										? 'text-red-600'
										: 'text-[#8a8a8a]'
								}`}
							>
								{charCount.imageAlt}/{SEO_LIMITS.imageAlt.max}
							</span>
						</div>
						<input
							type='text'
							value={formData.imageAlt || ''}
							onChange={e =>
								onInputChange(
									'imageAlt',
									e.target.value,
									SEO_LIMITS.imageAlt.max,
								)
							}
							disabled={isSubmitting}
							className='w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 border-gray-300 focus:border-green-600 focus:ring-green-600/20 disabled:opacity-50 disabled:bg-gray-100 placeholder:text-[#8a8a8a]'
							placeholder='Например: Соки и напитки в ассортименте'
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default ImageSection
