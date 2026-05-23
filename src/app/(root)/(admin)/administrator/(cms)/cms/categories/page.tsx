'use client'

import { Header } from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/Header'
import { Pagination } from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/Pagination'
import { SEORecommendations } from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/SEORecommendations'
import { CategoryForm } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/CategoryForm'
import { CategoryTable } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/CategoryTable'
import { HeaderActions } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/HeaderActions'
import { ItemsPerPageSelector } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/ItemPerPageSelector'
import { WarningAlert } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/WarningAlert'
import { useCategories } from '@/app/(root)/(admin)/administrator/(cms)/cms/hooks/useCategories'
import { useCategoryFormState } from '@/app/(root)/(admin)/administrator/(cms)/cms/hooks/useCategoryFormState'
import { categorySeoRecommendations } from '@/app/(root)/(admin)/administrator/(cms)/cms/utils/recommendations'
import { useAuthStore } from '@/store/authStore'
import { useCategoryStore } from '@/store/categoryStore'
import { useEffect, useState } from 'react'
import { Notification } from './_components/Notification'

const CategoriesPage = () => {
	const [notification, setNotification] = useState<{
		type: 'success' | 'error'
		message: string
	} | null>(null)
	const { user } = useAuthStore()
	const author = `${user?.surname} ${user?.name}`.trim() || 'Неизвестен'
	const {
		categories,
		totalAllItems,
		editingId,
		setIsSubmitting,
		showForm,
		originalImageUrl,
		formData,
		updateFormField,
		totalPages,
		currentPage,
		itemsPerPage,
		setItemsPerPage,
		setCurrentPage,
	} = useCategoryStore()
	if (!user) {
		return null
	}

	const { createCategory, updateCategory, deleteCategory, loadCategories } =
		useCategories()

	const {
		resetForm,
		generateSlug,
		saveImageFile,
		removeImage,
		uploadImageToServer,
		getKeywordsArray,
		deleteOldImage,
		startCreate,
		startEdit,
	} = useCategoryFormState()

	useEffect(() => {
		if (notification) {
			const timer = setTimeout(() => {
				setNotification(null)
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [notification])

	useEffect(() => {
		loadCategories({ page: currentPage })
	}, [currentPage, loadCategories])

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

	const handleUpdate = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		if (!editingId) return

		setIsSubmitting(true)

		try {
			let finalImageUrl = formData.image
			let shouldDeleteOldImage = false

			if (formData.image && formData.image.startsWith('blob:')) {
				try {
					const uploadResult = await uploadImageToServer()

					if (uploadResult) {
						finalImageUrl = uploadResult.url
						shouldDeleteOldImage = true
					} else {
						throw new Error('Не удалось загрузить изображение')
					}
				} catch (uploadError) {
					console.error('Ошибка загрузки изображения:', uploadError)
					setNotification({
						type: 'error',
						message:
							'Не удалось загрузить изображение. Попробуйте еще раз.',
					})
					setIsSubmitting(false)
					return
				}
			} else if (!formData.image && originalImageUrl) {
				shouldDeleteOldImage = true
			}

			if (shouldDeleteOldImage && originalImageUrl) {
				const deleteSuccess = await deleteOldImage(originalImageUrl)
				if (deleteSuccess) {
					console.warn('Старое изображение удалено')
				} else {
					console.warn('Не удалось удалить старое изображение')
				}
			}

			const updateData = {
				name: formData.name,
				slug: formData.slug,
				description: formData.description,
				image: finalImageUrl,
				imageAlt: formData.imageAlt,
				keywords: getKeywordsArray(),
			}

			const result = await updateCategory(updateData)

			if (result.success) {
				setNotification({
					type: 'success',
					message: 'Категория успешно обновлена',
				})
				resetForm()
			} else {
				console.error('Ошибка обновления категории:', result.message)
				setNotification({
					type: 'error',
					message: result.message || 'Ошибка обновления категории',
				})
			}
		} catch (error) {
			console.error('Неожиданная ошибка:', error)
			setNotification({
				type: 'error',
				message: 'Произошла ошибка при обновлении категории',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async (id: string) => {
		if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return

		const categoryToDelete = categories.find(c => c._id.toString() === id)

		const result = await deleteCategory(id)
		if (result.success) {
			if (categoryToDelete?.image) {
				try {
					await deleteOldImage(categoryToDelete.image)
				} catch (error) {
					console.error(
						'Не удалось удалить изображение категории:',
						error,
					)
				}
			}

			setNotification({
				type: 'success',
				message: 'Категория успешно удалена',
			})
		} else {
			setNotification({
				type: 'error',
				message: result.message || 'Ошибка удаления категории',
			})
		}
	}

	const handleItemsPerPageChange = (perPage: number) => {
		setItemsPerPage(perPage)
		setCurrentPage(1)
		loadCategories({ page: 1 })
	}

	return (
		<div className='relative'>
			<Header
				title='Управление категориями'
				description={`Всего категорий: ${totalAllItems}`}
			/>
			{notification && (
				<Notification
					type={notification.type}
					message={notification.message}
					onClose={() => setNotification(null)}
				/>
			)}
			<HeaderActions onCreate={startCreate} />
			<div className='mb-4'>
				<ItemsPerPageSelector
					value={itemsPerPage}
					onChange={handleItemsPerPageChange}
				/>
			</div>
			<WarningAlert />
			{showForm && (
				<CategoryForm
					onFieldChange={updateFormField}
					onGenerateSlug={generateSlug}
					onSaveImageFile={saveImageFile}
					onRemoveImage={removeImage}
					onSubmit={editingId ? handleUpdate : handleCreate}
					onCancel={resetForm}
				/>
			)}

			<CategoryTable onDelete={handleDelete} onEdit={startEdit} />
			{totalPages > 1 && <Pagination />}
			<SEORecommendations recommendations={categorySeoRecommendations} />
		</div>
	)
}

export default CategoriesPage
