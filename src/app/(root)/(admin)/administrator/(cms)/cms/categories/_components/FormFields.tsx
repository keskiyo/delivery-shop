import { FormFieldsProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/types'
import { useCategoryStore } from '@/store/categoryStore'
import { RotateCcw } from 'lucide-react'
import { SEO_LIMITS } from '../../utils/SEO_LIMITS'

export const FormFields = ({
	charCount,
	onInputChange,
	onGenerateSlug,
}: FormFieldsProps) => {
	const { isSubmitting, formData } = useCategoryStore()
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
			{/* Название */}
			<div>
				<div className='flex justify-between items-center mb-1'>
					<label className='block text-sm font-medium'>
						Название категории *
					</label>
					<span
						className={`text-xs ${
							charCount.name > SEO_LIMITS.name.max
								? 'text-red-600'
								: 'text-[#8a8a8a]'
						}`}
					>
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
					className='w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 border-gray-300 focus:border-green-600 focus:ring-green-600/20 disabled:opacity-50 disabled:bg-gray-100 placeholder:text-[#8a8a8a]'
					placeholder='Например: Соки'
				/>
			</div>

			{/* Slug */}
			<div>
				<div className='flex justify-between items-center mb-1'>
					<label className='block text-sm font-medium'>
						Алиас (slug) *
					</label>
					<span
						className={`text-xs ${
							charCount.slug > SEO_LIMITS.slug.max
								? 'text-red-600'
								: 'text-[#8a8a8a]'
						}`}
					>
						{charCount.slug}/{SEO_LIMITS.slug.max}
					</span>
				</div>
				<div className='flex gap-2'>
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
						className='flex-1 px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 border-gray-300 focus:border-green-600 focus:ring-green-600/20 disabled:opacity-50 disabled:bg-gray-100 placeholder:text-[#8a8a8a]'
						placeholder='soki'
					/>
					<button
						type='button'
						onClick={onGenerateSlug}
						className='flex items-center gap-1 px-4 py-2.5 bg-gray-50 text-[#474747] rounded hover:bg-gray-100 text-sm whitespace-nowrap cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400'
						title='Сгенерировать из названия'
					>
						<RotateCcw className='w-4 h-4' />
						Генерировать
					</button>
				</div>
				<p className='text-xs mt-1 text-[#8a8a8a]'>
					Только латиница, цифры и дефисы
				</p>
			</div>

			{/* Описание */}
			<div className='md:col-span-2'>
				<div className='flex justify-between items-center mb-1'>
					<label className='block text-sm font-medium'>
						Описание (мета-описание)
					</label>
					<span
						className={`text-xs ${
							charCount.description > SEO_LIMITS.description.max
								? 'text-red-600'
								: charCount.description <
											SEO_LIMITS.description.min &&
									  charCount.description > 0
									? 'text-yellow-600'
									: 'text-[#8a8a8a]'
						}`}
					>
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
					className='w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 resize-none border-gray-300 focus:border-green-600 focus:ring-green-600/20 disabled:opacity-50 disabled:bg-gray-100 placeholder:text-[#8a8a8a]'
					placeholder='Краткое описание категории для поисковых систем (10-160 символов)'
				/>
				<p className='text-xs mt-1 text-[#8a8a8a]'>
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
					<span
						className={`text-xs ${
							charCount.keywords > SEO_LIMITS.keywords.maxLength
								? 'text-red-600'
								: 'text-[#8a8a8a]'
						}`}
					>
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
					className='w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 border-gray-300 focus:border-green-600 focus:ring-green-600/20 disabled:opacity-50 disabled:bg-gray-100 placeholder:text-[#8a8a8a]'
					placeholder='мясо, напитки, польза и вред'
				/>
			</div>
		</div>
	)
}
