import { useConfirm } from '@/components/ui/confirm/ConfirmProvider'
import { useArticleStore } from '@/store/articleStore'
import { Eye, EyeOff, FileText, Globe, Save, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { SubmitSectionProps } from '../../articlesManagement/types'
import './css/modal-preview.css'
import { ArticlePreviewModal } from './tiptap-components/ArticlePreviewModal'

export const ArticleSubmitSection = ({ onCancel }: SubmitSectionProps) => {
	const confirmDialog = useConfirm()
	const { updateFormField, isSubmitting, isUploading, formData } =
		useArticleStore()

	const [articleStatus, setArticleStatus] = useState<'published' | 'draft'>(
		formData.status === 'published' || formData.status === 'draft'
			? formData.status
			: 'draft',
	)
	const [isFeatured, setIsFeatured] = useState<boolean>(
		formData.isFeatured || false,
	)
	const [showPreview, setShowPreview] = useState(false)

	useEffect(() => {
		if (formData.status) {
			const safeStatus =
				formData.status === 'published' ? 'published' : 'draft'
			setArticleStatus(safeStatus)
		}
		if (formData.isFeatured !== undefined) {
			setIsFeatured(formData.isFeatured)
		}
	}, [formData.status, formData.isFeatured])

	const handleStatusChange = (status: 'published' | 'draft') => {
		setArticleStatus(status)
		updateFormField('status', status)
	}

	const handleFeaturedChange = (featured: boolean) => {
		setIsFeatured(featured)
		updateFormField('isFeatured', featured)
	}

	const handleCancelWithConfirm = async () => {
		const hasData =
			formData.name.trim() !== '' ||
			formData.slug.trim() !== '' ||
			formData.description.trim() !== '' ||
			formData.keywords.trim() !== '' ||
			formData.image.trim() !== '' ||
			formData.content?.trim() !== '' ||
			formData.categoryId !== ''

		if (hasData) {
			const confirmCancel = await confirmDialog({
				title: 'Отменить создание статьи',
				description:
					'Вы уверены, что хотите отменить создание статьи? Все введенные данные будут потеряны.',
				confirmText: 'Отменить',
				variant: 'warning',
			})

			if (confirmCancel) {
				onCancel()
			}
		} else {
			onCancel()
		}
	}

	const canPreview = formData.content?.trim() !== ''

	return (
		<>
			<ArticlePreviewModal
				isOpen={showPreview}
				onClose={() => setShowPreview(false)}
			/>
			<div className='mb-6 bg-surface-subtle p-4 rounded-xl border border-border'>
				<div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
					<div className='flex-1'>
						<h3 className='text-lg font-semibold mb-1 flex items-center gap-2'>
							<Eye className='w-5 h-5 text-brand' />
							Предпросмотр статьи
						</h3>
						<p className='text-muted-foreground text-sm'>
							Посмотрите, как статья будет выглядеть на сайте
							перед сохранением
						</p>
					</div>
					<button
						type='button'
						onClick={() => setShowPreview(true)}
						disabled={!canPreview || isUploading || isSubmitting}
						className={`flex items-center justify-center gap-2 px-2 md:px-6 py-3 rounded-lg cursor-pointer transition-custom disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap shadow-lg ${
							canPreview
								? 'bg-brand text-white hover:bg-brand-hover transform hover:-translate-y-0.5 '
								: 'bg-surface-pressed text-white'
						}`}
						title={
							!canPreview
								? 'Добавьте контент статьи для предпросмотра'
								: 'Открыть предпросмотр статьи'
						}
					>
						<Eye className='w-5 h-5' />
						<span>Предпросмотр статьи</span>
					</button>
				</div>

				{!canPreview && (
					<div className='mt-3 p-3 bg-warning-soft border border-warning/30 rounded-lg'>
						<p className='text-warning text-sm'>
							Для предпросмотра необходимо заполнить название и
							текст статьи
						</p>
					</div>
				)}
			</div>
			<div className='my-6 bg-surface-subtle p-4 rounded border border-border'>
				<h3 className='text-lg font-medium mb-4 flex items-center gap-2'>
					<Star className='w-5 h-5' />
					Статус избранности
				</h3>
				<div className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
						<button
							type='button'
							onClick={() => handleFeaturedChange(false)}
							disabled={isUploading || isSubmitting}
							className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-custom disabled:opacity-50 disabled:cursor-not-allowed ${
								!isFeatured
									? 'bg-card border-brand shadow-sm'
									: 'bg-card border-border hover:bg-surface-hover'
							}`}
						>
							<FileText className='w-5 h-5' />
							<div className='text-left'>
								<div className='font-medium'>
									Обычная статья
								</div>
								<div className='text-sm'>
									Стандартное отображение
								</div>
							</div>
						</button>

						<button
							type='button'
							onClick={() => handleFeaturedChange(true)}
							disabled={isUploading || isSubmitting}
							className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-custom disabled:opacity-50 disabled:cursor-not-allowed ${
								isFeatured
									? 'bg-warning text-white border-warning shadow-sm'
									: 'bg-card border-border hover:bg-surface-hover'
							}`}
						>
							<Star className='w-5 h-5' />
							<div className='text-left'>
								<div className='font-medium'>
									Избранная статья
								</div>
								<div className='text-sm'>
									Выделить особым образом
								</div>
							</div>
						</button>
					</div>

					<div className='text-sm text-muted-foreground p-3 bg-card rounded border border-border'>
						{isFeatured ? (
							<div>
								<p className='font-medium mb-2'>
									Избранная статья будет:
								</p>
								<ul className='list-disc pl-5 space-y-1'>
									<li>Показана на главной странице блога</li>
									<li>
										Выделена в блоке &quot;Рекомендуем&quot;
									</li>
									<li>Отмечена звездочкой в списках</li>
									<li>Показывается вверху списков статей</li>
								</ul>
							</div>
						) : (
							<div>
								<p className='font-medium mb-2'>
									Обычная статья будет:
								</p>
								<ul className='list-disc pl-5 space-y-1'>
									<li>Отображаться в общих списках статей</li>
									<li>Сортироваться по дате публикации</li>
									<li>Доступна через категории и поиск</li>
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className='my-6 bg-surface-subtle p-4 rounded border border-border'>
				<h3 className='text-lg font-medium mb-4 flex items-center gap-2'>
					<Globe className='w-5 h-5' />
					Статус публикации
				</h3>
				<div className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
						<button
							type='button'
							onClick={() => handleStatusChange('draft')}
							disabled={isUploading || isSubmitting}
							className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-custom disabled:opacity-50 disabled:cursor-not-allowed ${
								articleStatus === 'draft'
									? 'bg-warning text-white border-warning shadow-sm'
									: 'bg-card border-border hover:bg-surface-hover'
							}`}
						>
							<EyeOff className='w-5 h-5' />
							<div className='text-left'>
								<div className='font-medium'>Черновик</div>
								<div className='text-sm'>
									Сохранить, но не публиковать
								</div>
							</div>
						</button>

						<button
							type='button'
							onClick={() => handleStatusChange('published')}
							disabled={isUploading || isSubmitting}
							className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-custom disabled:opacity-50 disabled:cursor-not-allowed ${
								articleStatus === 'published'
									? 'bg-brand text-white border-brand shadow-sm'
									: 'bg-card border-border hover:bg-surface-hover'
							}`}
						>
							<Eye className='w-5 h-5' />
							<div className='text-left'>
								<div className='font-medium'>Опубликовать</div>
								<div className='text-sm'>
									Сразу опубликовать на сайте
								</div>
							</div>
						</button>
					</div>

					<div className='text-sm text-muted-foreground p-3 bg-card rounded border border-border'>
						{articleStatus === 'draft' ? (
							<div>
								<p className='font-medium mb-2'>
									Статья сохранится как черновик:
								</p>
								<ul className='list-disc pl-5 space-y-1'>
									<li>
										Будет видна только в административной
										панели
									</li>
									<li>
										Вы сможете редактировать и опубликовать
										позже
									</li>
									<li>
										Не будет доступна пользователям сайта
									</li>
								</ul>
							</div>
						) : (
							<div>
								<p className='font-medium mb-2'>
									Статья будет опубликована сразу:
								</p>
								<ul className='list-disc pl-5 space-y-1'>
									<li>Сразу появится на сайте</li>
									<li>Будет доступна всем пользователям</li>
									<li>Попадет в ленту статей и поиск</li>
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className='flex flex-col sm:flex-row gap-3 mt-6'>
				<button
					type='submit'
					disabled={isUploading || isSubmitting}
					className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg cursor-pointer transition-custom disabled:opacity-50 disabled:cursor-not-allowed font-medium flex-1 ${
						articleStatus === 'published'
							? isFeatured
								? 'bg-warning text-white hover:bg-warning/90'
								: 'bg-brand text-white hover:bg-brand-hover'
							: 'bg-warning text-white hover:bg-warning/90'
					}`}
				>
					<Save className='w-5 h-5' />
					<span>
						{isSubmitting
							? 'Сохранение...'
							: articleStatus === 'published'
								? isFeatured
									? 'Опубликовать как избранную'
									: 'Опубликовать статью'
								: isFeatured
									? 'Сохранить избранный черновик'
									: 'Сохранить черновик'}
					</span>
				</button>

				<button
					type='button'
					onClick={handleCancelWithConfirm}
					disabled={isUploading || isSubmitting}
					className='px-5 py-3 border border-border rounded-lg hover:bg-surface-hover cursor-pointer transition-custom disabled:opacity-50 disabled:cursor-not-allowed font-medium'
				>
					Отмена
				</button>
			</div>
		</>
	)
}
