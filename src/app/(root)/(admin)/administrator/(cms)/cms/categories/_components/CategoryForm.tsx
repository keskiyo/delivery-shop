import { CategoryFormFields } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/CategoryFormFields'
import { CategorySubmitSection } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/CategorySubmitSection'
import { ImageSection } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/ImageSection'
import {
	CategoryFormProps,
	CharCount,
	FormField,
} from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/types'
import { showToast } from '@/lib/showToast'
import { useCategoryStore } from '@/store/categoryStore'

export const CategoryForm = ({
	onFieldChange,
	onGenerateSlug,
	onSaveImageFile,
	onRemoveImage,
	onSubmit,
	onCancel,
}: CategoryFormProps) => {
	const { setIsUploading, formData } = useCategoryStore()

	const charCount: CharCount = {
		name: formData.name.length,
		slug: formData.slug.length,
		description: formData.description.length,
		keywords: formData.keywords.length,
		imageAlt: formData.imageAlt.length,
	}

	const handleInputChange = (
		field: string,
		value: string,
		maxLength: number,
	) => {
		if (value.length <= maxLength) {
			onFieldChange(field as FormField, value)
		}
	}

	const handleGenerateSlug = () => {
		onGenerateSlug()
	}

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (file.size > 5 * 1024 * 1024) {
			showToast({
				type: 'error',
				message: 'Размер файла не должен превышать 5MB',
			})
			return
		}

		setIsUploading(true)

		try {
			onSaveImageFile(file)
		} catch (error) {
			console.error('Ошибка при выборе изображения:', error)
			showToast({
				type: 'error',
				message: 'Ошибка при выборе изображения',
			})
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<div className='mb-8 bg-card rounded shadow-sm p-6'>
			<h2 className='text-xl font-semibold mb-4'>
				Создание новой категории
			</h2>
			<form onSubmit={onSubmit}>
				<ImageSection
					type='category'
					charCount={charCount}
					onInputChange={handleInputChange}
					onFileChange={handleFileChange}
					onRemoveImage={onRemoveImage}
				/>
				<CategoryFormFields
					charCount={charCount}
					onInputChange={handleInputChange}
					onGenerateSlug={handleGenerateSlug}
				/>
				<CategorySubmitSection onCancel={onCancel} />
			</form>
		</div>
	)
}
