import { FormFieldsProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/types'
import { useCategoryStore } from '@/store/categoryStore'
import { RotateCcw } from 'lucide-react'
import { SEO_LIMITS } from '../../utils/SEO_LIMITS'

export const CategoryFormFields = ({
	charCount,
	onInputChange,
	onGenerateSlug,
}: FormFieldsProps) => {
	const { isSubmitting, formData } = useCategoryStore()
	const inputClasses =
		'w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 border-border bg-card focus:border-brand focus:ring-brand/20 disabled:opacity-50 disabled:bg-surface-hover placeholder:text-muted-foreground'

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
			{/* Название */}
			<div>
				<div className='flex justify-between items-center mb-1'>
					<label className='block text-sm font-medium'>
						Название категории{' '}
						<span className='text-danger'>*</span>
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
					disabled={isSubmitting}
					required
					className={inputClasses}
					placeholder='Например: Соки'
				/>
			</div>

			{/* Slug */}
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
						disabled={isSubmitting}
						required
						className={`${inputClasses} flex-1`}
						placeholder='soki'
					/>
					<button
						type='button'
						onClick={onGenerateSlug}
						className='flex w-full items-center gap-1 px-4 py-2.5 bg-surface-hover text-foreground rounded hover:bg-surface-pressed text-sm whitespace-nowrap cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-border hover:border-text-soft focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand'
						title='Сгенерировать из названия'
					>
						<RotateCcw className='w-4 h-4' />
						Генерировать
					</button>
				</div>
				<p className='text-xs mt-1 text-muted-foreground'>
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
					disabled={isSubmitting}
					rows={3}
					className={`${inputClasses} resize-none`}
					placeholder='Краткое описание категории для поисковых систем (10-160 символов)'
				/>
				<p className='text-xs mt-1 text-muted-foreground'>
					Оптимальная длина для SEO: {SEO_LIMITS.description.min}-
					{SEO_LIMITS.description.max} символов
				</p>
			</div>

			{/* Ключевые слова */}
			<div className='md:col-span-2'>
				<div className='flex justify-between items-center mb-1'>
					<label className='block text-sm font-medium'>
						Ключевые слова (через запятую)
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
					className={`${inputClasses} text-xs`}
					placeholder='мясо, напитки, польза и вред'
				/>
			</div>
		</div>
	)
}
