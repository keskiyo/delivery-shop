import { useArticleStore } from '@/store/articleStore'
import { RotateCcw } from 'lucide-react'
import { SEO_LIMITS } from '../../../utils/SEO_LIMITS'
import { ArticleFormFieldsProps } from '../../types/form/form-fields.types'

export const ArticleFormFields = ({
	charCount,
	onInputChange,
	onGenerateSlug,
}: ArticleFormFieldsProps) => {
	const { isSubmitting, formData } = useArticleStore()
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
			<div>
				<div className='flex justify-between items-center mb-1'>
					<label className='block text-sm font-medium'>
						Название статьи <span className='text-danger'>*</span>
					</label>
					<span className='text-xs text-muted-foreground'>
						{charCount.name}/{SEO_LIMITS.name.max}
					</span>
				</div>
				<input
					type='text'
					value={formData.name}
					onChange={e =>
						onInputChange(
							'name',
							e.target.value,
							SEO_LIMITS.name.max,
						)
					}
					required
					disabled={isSubmitting}
					className='w-full px-3 py-2.5 border border-border rounded focus:outline-none focus:ring-3 transition-custom
           bg-card focus:border-brand focus:ring-brand/20
          disabled:opacity-50 disabled:bg-surface-subtle placeholder:text-muted-foreground'
					placeholder='Например: Соки'
				/>
			</div>
			<div>
				<div className='flex justify-between items-center mb-1'>
					<label className='block text-sm font-medium'>
						Алиас (slug) <span className='text-danger'>*</span>
					</label>
					<span className='text-xs text-muted-foreground'>
						{charCount.slug}/{SEO_LIMITS.slug.max}
					</span>
				</div>
				<div className='flex flex-wrap gap-2'>
					<input
						type='text'
						value={formData.slug}
						onChange={e => {
							const value = e.target.value.toLowerCase()
							const cleaned = value
								.replace(/\s+/g, '-')
								.replace(/[^a-z0-9-]/g, '')

							onInputChange('slug', cleaned, SEO_LIMITS.slug.max)
						}}
						required
						disabled={isSubmitting}
						className='flex-1 px-3 py-2.5 rounded focus:outline-none focus:ring-3 transition-custom bg-card focus:border-brand focus:ring-brand/20 disabled:opacity-50 disabled:bg-surface-subtle placeholder:text-muted-foreground border border-border'
						placeholder='soki'
					/>
					<button
						type='button'
						onClick={onGenerateSlug}
						disabled={isSubmitting}
						className='flex w-full items-center gap-1 px-4 py-2.5 rounded hover:bg-surface-hover text-sm whitespace-nowrap cursor-pointer transition-custom disabled:opacity-50 disabled:cursor-not-allowed border border-border  focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand'
						title='Сгенерировать из названия'
					>
						<RotateCcw className='w-4 h-4' />
						Генерировать
					</button>
				</div>

				<p className='text-xs text-muted-foreground mt-1'>
					Только латиница, цифры и дефисы
				</p>
			</div>

			{/* Описание */}
			<div className='md:col-span-2'>
				<div className='flex justify-between items-center mb-1'>
					<label className='block text-sm font-medium'>
						Описание (мета-описание)
					</label>
					<span className='text-xs text-muted-foreground'>
						{charCount.description}/{SEO_LIMITS.description.max}
					</span>
				</div>
				<textarea
					value={formData.description}
					onChange={e =>
						onInputChange(
							'description',
							e.target.value,
							SEO_LIMITS.description.max,
						)
					}
					rows={3}
					disabled={isSubmitting}
					className='w-full px-3 py-2.5 border border-border rounded focus:outline-none focus:ring-3 transition-custom resize-none bg-card focus:border-brand focus:ring-brand/20
          disabled:opacity-50 disabled:bg-surface-subtle placeholder:text-muted-foreground'
					placeholder='Краткое описание категории для поисковых систем (10-160 символов)'
				/>
			</div>

			{/* Ключевые слова */}
			<div className='md:col-span-2'>
				<div className='flex justify-between items-center mb-1'>
					<label className='block text-sm font-medium'>
						Ключевые слова
						<span className='text-muted-foreground text-xs ml-2'>
							(через запятую)
						</span>
					</label>
					<span className='text-xs text-muted-foreground'>
						{charCount.keywords}/{SEO_LIMITS.keywords.maxLength}
					</span>
				</div>
				<input
					type='text'
					value={formData.keywords}
					onChange={e =>
						onInputChange(
							'keywords',
							e.target.value,
							SEO_LIMITS.keywords.maxLength,
						)
					}
					disabled={isSubmitting}
					className='text-xs w-full px-3 py-2.5 border border-border rounded focus:outline-none focus:ring-3 transition-custom bg-card focus:border-brand focus:ring-brand/20 disabled:opacity-50 disabled:bg-surface-subtle placeholder:text-muted-foreground'
					placeholder='мясо, напитки, польза и вред'
				/>
			</div>
		</div>
	)
}
