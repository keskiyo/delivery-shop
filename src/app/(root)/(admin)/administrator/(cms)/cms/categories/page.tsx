'use client'

import { Header } from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/Header'
import { SEORecommendations } from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/SEORecommendations'
import CategoryForm from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/CategoryForm'
import CategoryTable from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/CategoryTable'
import { WarningAlert } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/WarningAlert'
import { useCategories } from '@/app/(root)/(admin)/administrator/(cms)/cms/hooks/useCategories'
import { useCategoryFormState } from '@/app/(root)/(admin)/administrator/(cms)/cms/hooks/useCategoryFormState'
import { categorySeoRecommendations } from '@/app/(root)/(admin)/administrator/(cms)/cms/utils/recommendations'
import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'
import { Notification } from './_components/Notification'

const CategoriesPage = () => {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [notification, setNotification] = useState<{
		type: 'success' | 'error'
		message: string
	} | null>(null)
	const { user } = useAuthStore()
	const author = `${user?.surname} ${user?.name}`.trim() || 'Неизвестен'

	const { loading, createCategory } = useCategories()

	const {
		formData,
		updateFormField,
		generateSlug,
		saveImageFile,
		removeImage,
		uploadImageToServer,
		getKeywordsArray,
		resetForm,
	} = useCategoryFormState()

	useEffect(() => {
		if (notification) {
			const timer = setTimeout(() => {
				setNotification(null)
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [notification])

	const handleCreate = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			let finalImageUrl = ''
			if (formData.image && formData.image.startsWith('blob:')) {
				try {
					const uploadResult = await uploadImageToServer()
					if (uploadResult) {
						finalImageUrl = uploadResult.url
					} else {
						throw new Error('Не удалось загрузить изображение')
					}
				} catch (uploadError) {
					console.error('Ошибка загрузки изображения:', uploadError)
					setNotification({
						type: 'error',
						message: 'Не удалось загрузить изображение',
					})
					setIsSubmitting(false)
					return
				}
			}

			const categoryData = {
				name: formData.name,
				slug: formData.slug,
				description: formData.description,
				keywords: getKeywordsArray(),
				image: finalImageUrl,
				imageAlt: formData.imageAlt,
				numericId: null,
				author,
			}

			const createResult = await createCategory(categoryData)

			if (createResult.success) {
				setNotification({
					type: 'success',
					message: 'Категория успешно создана',
				})
				resetForm()
			} else {
				setNotification({
					type: 'error',
					message:
						createResult.message || 'Ошибка создания категории',
				})
			}
		} catch (error) {
			console.error('Неожиданная ошибка:', error)
			setNotification({
				type: 'error',
				message: 'Произошла непредвиденная ошибка',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='relative'>
			<Header
				title='Управление категориями'
				description={`Всего категорий: ${'????'}`}
			/>
			{notification && (
				<Notification
					type={notification.type}
					message={notification.message}
					onClose={() => setNotification(null)}
				/>
			)}
			<WarningAlert />
			<CategoryForm
				formData={formData}
				isSubmitting={isSubmitting}
				onFieldChange={updateFormField}
				onGenerateSlug={generateSlug}
				onSaveImageFile={saveImageFile}
				onRemoveImage={removeImage}
				onSubmit={handleCreate}
				onCancel={resetForm}
			/>
			<CategoryTable />
			<SEORecommendations recommendations={categorySeoRecommendations} />
		</div>
	)
}

export default CategoriesPage
