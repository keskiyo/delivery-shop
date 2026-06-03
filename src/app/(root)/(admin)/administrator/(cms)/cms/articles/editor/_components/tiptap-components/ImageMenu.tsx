import { ImageMenuProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/articles/types/tiptap'
import { ImagePlus, Upload } from 'lucide-react'
import { ChangeEvent, useCallback, useRef } from 'react'
import { useImageUpload } from '../../../hooks/useImageUpload'

export const ImageMenu = ({ editor, onDragOverChange }: ImageMenuProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { isUploading, uploadFile, insertByUrl } = useImageUpload(editor)

	const handleFileUpload = useCallback(
		async (e: ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files
			if (!files || !files.length) return

			await uploadFile(files[0])

			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		},
		[uploadFile],
	)

	const handleButtonMouseEnter = () => {
		if (onDragOverChange) {
			onDragOverChange(true)
		}
	}

	const handleButtonMouseLeave = () => {
		if (onDragOverChange) {
			onDragOverChange(false)
		}
	}

	return (
		<div className='flex items-center gap-2'>
			<span className='text-xs text-muted-foreground mr-1'>
				Изображения:
			</span>

			<div
				className='relative group'
				onMouseEnter={handleButtonMouseEnter}
				onMouseLeave={handleButtonMouseLeave}
			>
				<input
					type='file'
					ref={fileInputRef}
					accept='.jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/webp'
					className='hidden'
					onChange={handleFileUpload}
					disabled={isUploading}
				/>
				<button
					type='button'
					onClick={() => fileInputRef.current?.click()}
					className={`px-1 py-2 rounded duration-300 cursor-pointer flex items-center gap-1 relative ${
						isUploading
							? 'bg-surface-hover text-muted-foreground cursor-not-allowed'
							: 'hover:bg-surface-pressed text-muted-foreground'
					}`}
					title={
						isUploading ? 'Загрузка...' : 'Загрузить изображение'
					}
					disabled={isUploading}
				>
					<Upload
						className={`w-4 h-4 ${isUploading ? 'animate-pulse' : ''}`}
					/>
					{isUploading && <span className='text-xs'>...</span>}
				</button>
			</div>

			<button
				type='button'
				onClick={insertByUrl}
				className='p-2 rounded hover:bg-surface-pressed duration-300 cursor-pointer text-muted-foreground'
				title='Вставить по URL'
				disabled={isUploading}
			>
				<ImagePlus className='w-4 h-4' />
			</button>
		</div>
	)
}
