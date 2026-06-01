'use client'

import { articleSeoRecommendations } from '@/app/(root)/(admin)/administrator/(cms)/cms/utils/recommendations'
import { Loader } from '@/components/features/common/loader'
import { showPromiseToast, showToast } from '@/lib/showToast'
import { useArticleStore } from '@/store/articleStore'
import { useAuthStore } from '@/store/authStore'
import { useCategoryStore } from '@/store/categoryStore'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from '../../_components/Header'
import { SEORecommendations } from '../../_components/SEORecommendations'
import { useArticleFormState } from '../hooks/useArticleFormState'
import { useArticles } from '../hooks/useArticles'
import { ArticleForm } from './_components/ArticleForm'

const EditorPage = () => {
	const [currentArticleId, setCurrentArticleId] = useState<string | null>(
		null,
	)
	const [isLoading, setIsLoading] = useState(false)
	const { user } = useAuthStore()
	const searchParams = useSearchParams()

	const author = `${user?.surname} ${user?.name}`.trim() || 'Неизвестен'

	const {
		formData,
		setIsSubmitting,
		updateFormField,
		setArticleData,
		resetFormData,
	} = useArticleStore()

	const { createArticle, getArticle } = useArticles()

	useEffect(() => {
		const loadArticle = async () => {
			const articleId = searchParams?.get('id')

			if (articleId) {
				setIsLoading(true)
				setCurrentArticleId(articleId)

				try {
					const result = await getArticle(articleId)

					if (result.success && result.data) {
						setArticleData(result.data)
					} else {
						showToast({
							type: 'error',
							message:
								result.message || 'Не удалось загрузить статью',
						})
					}
				} catch (error) {
					console.error('Ошибка загрузки статьи:', error)
					showToast({
						type: 'error',
						message: 'Ошибка загрузки статьи',
					})
				} finally {
					setIsLoading(false)
				}
			} else {
				resetFormData()
			}
		}

		loadArticle()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams])

	const {
		generateSlug,
		saveImageFile,
		removeImage,
		uploadImageToServer,
		getKeywordsArray,
		resetForm,
	} = useArticleFormState()

	const { loadCategories } = useCategoryStore()

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				await loadCategories({ unlimited: true })
			} catch (error) {
				console.error('Ошибка загрузки категорий:', error)
			}
		}
		fetchCategories()
	}, [loadCategories])

	const handleCreate = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			let finalImageUrl = formData.image
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
							pending: 'Загружаем изображение статьи...',
							success: 'Изображение статьи загружено',
							error: 'Не удалось загрузить изображение',
						},
					)
					finalImageUrl = uploadResult.url
				} catch (uploadError) {
					console.error('Ошибка загрузки изображения:', uploadError)
				}
			}

			const articleId = currentArticleId || undefined

			const articleData = {
				name: formData.name,
				slug: formData.slug,
				description: formData.description,
				keywords: getKeywordsArray(),
				image: finalImageUrl,
				imageAlt: formData.imageAlt,
				numericId: null,
				author,
				categoryId: formData.categoryId,
				categoryName: formData.categoryName,
				categorySlug: formData.categorySlug,
				content: formData.content || '',
				status: formData.status || 'draft',
				isFeatured: formData.isFeatured || false,
				views: 0,
				_id: articleId,
			}

			const createResult = await showPromiseToast(
				(async () => {
					const result = await createArticle(articleData)
					if (!result.success) {
						throw new Error(
							result.message || 'Ошибка создания статьи',
						)
					}
					return result
				})(),
				{
					pending: currentArticleId
						? 'Сохраняем изменения...'
						: 'Создаем статью...',
					success: currentArticleId
						? 'Изменения сохранены'
						: 'Статья успешно создана',
					error: currentArticleId
						? 'Ошибка сохранения статьи'
						: 'Ошибка создания статьи',
				},
			)

			if (createResult.success) {
				if (createResult.data?._id && !currentArticleId) {
					setCurrentArticleId(createResult.data?._id)
				}
			}
		} catch (error) {
			console.error('Неожиданная ошибка:', error)
		} finally {
			setIsSubmitting(false)
			window.scroll({ top: 0, behavior: 'smooth' })
		}
	}

	if (isLoading) return <Loader />

	return (
		<div className='relative'>
			<Header title='Текстовый редактор' description='Создание статей' />
			<ArticleForm
				onFieldChange={updateFormField}
				onGenerateSlug={generateSlug}
				onSaveImageFile={saveImageFile}
				onRemoveImage={removeImage}
				onSubmit={handleCreate}
				onCancel={resetForm}
			/>

			<SEORecommendations recommendations={articleSeoRecommendations} />
		</div>
	)
}

export default EditorPage
