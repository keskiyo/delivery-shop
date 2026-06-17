import { ArticlePreviewModalProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/articles/types/tiptap'
import { useArticleStore } from '@/store/articleStore'
import { AlertTriangle, ExternalLink, X } from 'lucide-react'
import Image from 'next/image'

export const ArticlePreviewModal = ({
	isOpen,
	onClose,
}: ArticlePreviewModalProps) => {
	const { formData } = useArticleStore()

	if (!isOpen) return null

	const renderArticleContent = () => {
		if (!formData.content) {
			return '<p style="text-align: center; color: var(--muted-foreground); font-style: italic;">Контент статьи отсутствует</p>'
		}

		return formData.content
	}

	return (
		<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-150 p-2 sm:p-4 animate-fadeIn'>
			<div className='bg-card border border-border shadow-2xl w-full h-full flex flex-col animate-slideUp overflow-hidden'>
				<div className='flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-surface-subtle'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-brand-soft rounded text-brand'>
							<ExternalLink className='w-5 h-5' />
						</div>
						<h2 className='text-xl sm:text-2xl font-bold text-foreground'>
							Предпросмотр статьи
						</h2>
					</div>
					<button
						onClick={onClose}
						className='p-2 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded transition-custom cursor-pointer'
						aria-label='Закрыть'
					>
						<X className='w-5 h-5' />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto bg-background'>
					<div className='px-4 sm:px-6 py-6 max-w-4xl mx-auto'>
						<div className='mb-4 flex items-start gap-2 rounded border border-warning/40 bg-warning-soft px-3 py-2 text-sm text-warning'>
							<AlertTriangle className='w-4 h-4 shrink-0 mt-0.5' />
							Это предварительный просмотр. Статья еще не
							сохранена и может отличаться от финальной версии.
						</div>

						<h1 className='text-3xl font-bold mb-4 text-foreground'>
							{formData.name || 'Новая статья'}
						</h1>

						{formData.image && formData.image.trim() !== '' && (
							<div className='relative rounded overflow-hidden shadow-lg'>
								<Image
									src={formData.image}
									alt={formData.imageAlt || formData.name}
									width={800}
									height={450}
									className='h-auto w-full object-cover'
								/>
							</div>
						)}
						<div
							className='ProseMirror tiptap rounded border border-border bg-card p-4 text-foreground'
							dangerouslySetInnerHTML={{
								__html: renderArticleContent(),
							}}
						/>
					</div>
				</div>

				<div className='border-t border-border px-4 sm:px-6 py-4 bg-surface-subtle'>
					<div className='flex flex-col sm:flex-row justify-end items-center gap-4'>
						<div className='flex gap-3'>
							<button
								onClick={onClose}
								className='px-5 py-2.5 bg-brand text-white rounded hover:bg-brand-hover font-medium transition-custom cursor-pointer focus:outline-none focus:ring-3 focus:ring-brand/20'
							>
								Закрыть предпросмотр
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
