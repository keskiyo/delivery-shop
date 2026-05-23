import { FormFields } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/FormFields'
import { ImageSection } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/ImageSection'
import { SubmitSection } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/SubmitSection'
import {
	CategoryFormProps,
	CharCount,
	FormField,
} from '@/app/(root)/(admin)/administrator/(cms)/cms/types'
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
		field: FormField,
		value: string,
		maxLength: number,
	) => {
		if (value.length <= maxLength) {
			onFieldChange(field, value)
		}
	}

	const handleGenerateSlug = () => {
		onGenerateSlug()
	}

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (file.size > 5 * 1024 * 1024) {
			alert('Размер файла не должен превышать 5MB')
			return
		}

		setIsUploading(true)

		try {
			onSaveImageFile(file)
		} catch (error) {
			console.error('Ошибка при выборе изображения:', error)
			alert('Ошибка при выборе изображения')
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
					charCount={charCount}
					onInputChange={handleInputChange}
					onFileChange={handleFileChange}
					onRemoveImage={onRemoveImage}
				/>
				<FormFields
					charCount={charCount}
					onInputChange={handleInputChange}
					onGenerateSlug={handleGenerateSlug}
				/>
				<SubmitSection onCancel={onCancel} />
			</form>
		</div>
	)
}
