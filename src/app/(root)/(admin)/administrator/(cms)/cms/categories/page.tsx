'use client'

import { Header } from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/Header'
import { Pagination } from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/Pagination'
import { SEORecommendations } from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/SEORecommendations'
import { CategoryForm } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/CategoryForm'
import { CategoryTable } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/CategoryTable'
import { HeaderActions } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/HeaderActions'
import { ItemsPerPageSelector } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/ItemPerPageSelector'
import { ReorderStatus } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/ReorderStatus'
import { WarningAlert } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/WarningAlert'
import { useCategories } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/hooks/useCategories'
import { useCategoryFormState } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/hooks/useCategoryFormState'
import type { Category } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/types'
import { categorySeoRecommendations } from '@/app/(root)/(admin)/administrator/(cms)/cms/utils/recommendations'
import { showPromiseToast } from '@/lib/showToast'
import { useAuthStore } from '@/store/authStore'
import { useCategoryStore } from '@/store/categoryStore'
import { useEffect } from 'react'

const CategoriesPage = () => {
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
		setIsReordering,
	} = useCategoryStore()

	const {
		createCategory,
		updateCategory,
		deleteCategory,
		loadCategories,
		reorderCategories,
	} = useCategories()

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
		if (!user) return

		loadCategories({ page: currentPage })
	}, [currentPage, loadCategories, user])

	const handleCreate = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			let finalImageUrl = ''
			if (formData.image && formData.image.startsWith('blob:')) {
				try {
					const uploadResult = await showPromiseToast(
						(async () => {
							const result = await uploadImageToServer()
							if (!result) {
								throw new Error(
									'Не удалось загрузить изображение',
								)
							}
							return result
						})(),
						{
							pending: 'Загружаем изображение категории...',
							success: 'Изображение категории загружено',
							error: 'Не удалось загрузить изображение',
						},
					)
					finalImageUrl = uploadResult.url
				} catch (uploadError) {
					console.error('Ошибка загрузки изображения:', uploadError)
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

			const createResult = await showPromiseToast(
				(async () => {
					const result = await createCategory(categoryData)
					if (!result.success) {
						throw new Error(
							result.message || 'Ошибка создания категории',
						)
					}
					return result
				})(),
				{
					pending: 'Создаем категорию...',
					success: 'Категория успешно создана',
					error: 'Ошибка создания категории',
				},
			)

			if (createResult.success) {
				resetForm()
			}
		} catch (error) {
			console.error('Неожиданная ошибка:', error)
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
					const uploadResult = await showPromiseToast(
						(async () => {
							const result = await uploadImageToServer()
							if (!result) {
								throw new Error(
									'Не удалось загрузить изображение',
								)
							}
							return result
						})(),
						{
							pending: 'Загружаем изображение категории...',
							success: 'Изображение категории загружено',
							error: 'Не удалось загрузить изображение',
						},
					)
					finalImageUrl = uploadResult.url
					shouldDeleteOldImage = true
				} catch (uploadError) {
					console.error('Ошибка загрузки изображения:', uploadError)
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

			const result = await showPromiseToast(
				(async () => {
					const result = await updateCategory(editingId, updateData)
					if (!result.success) {
						throw new Error(
							result.message || 'Ошибка обновления категории',
						)
					}
					return result
				})(),
				{
					pending: 'Обновляем категорию...',
					success: 'Категория успешно обновлена',
					error: 'Ошибка обновления категории',
				},
			)

			if (result.success) {
				resetForm()
			}
		} catch (error) {
			console.error('Неожиданная ошибка:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async (id: string) => {
		if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return

		const categoryToDelete = categories.find(c => c._id.toString() === id)

		try {
			const result = await showPromiseToast(
				(async () => {
					const result = await deleteCategory(id)
					if (!result.success) {
						throw new Error(
							result.message || 'Ошибка удаления категории',
						)
					}
					return result
				})(),
				{
					pending: 'Удаляем категорию...',
					success: 'Категория успешно удалена',
					error: 'Ошибка удаления категории',
				},
			)
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
			}
		} catch (error) {
			console.error('Ошибка удаления категории:', error)
		}
	}

	const handleItemsPerPageChange = (perPage: number) => {
		setItemsPerPage(perPage)
		setCurrentPage(1)
		loadCategories({ page: 1 })
	}

	const handleReorder = async (reorderedCategories: Category[]) => {
		console.log(reorderedCategories)
		setIsReordering(true)

		try {
			const dataForApi = reorderedCategories.map(category => ({
				_id: category._id.toString(),
				numericId: category.numericId || 0,
			}))

			await showPromiseToast(
				(async () => {
					const result = await reorderCategories(dataForApi)
					if (!result.success) {
						throw new Error(
							result.message || 'Ошибка обновления порядка',
						)
					}
					return result
				})(),
				{
					pending: 'Обновляем порядок категорий...',
					success: 'Порядок категорий успешно обновлен',
					error: 'Ошибка обновления порядка',
				},
			)

		} catch (error) {
			console.error('Ошибка:', error)
		} finally {
			setIsReordering(false)
		}
	}

	if (!user) {
		return null
	}

	return (
		<div className='relative'>
			<Header
				title='Управление категориями'
				description={`Всего категорий: ${totalAllItems}`}
			/>
			<HeaderActions onCreate={startCreate} />
			<div className='mb-4'>
				<ItemsPerPageSelector
					value={itemsPerPage}
					onChange={handleItemsPerPageChange}
				/>
				<div className='text-sm mt-1 text-muted-foreground'>
					Текущие параметры: страница {currentPage}, элементов:{' '}
					{itemsPerPage}
				</div>
			</div>
			<ReorderStatus />
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

			<CategoryTable
				onDelete={handleDelete}
				onEdit={startEdit}
				onReorder={handleReorder}
			/>
			{totalPages > 1 && <Pagination />}
			<SEORecommendations recommendations={categorySeoRecommendations} />
		</div>
	)
}

export default CategoriesPage
