'use client'

import { useCategoryStore } from '@/store/categoryStore'
import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { CategorySelectProps } from '../../types'

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
	const { categories } = useCategoryStore()
	const [isOpen, setIsOpen] = useState(false)

	const selectedCategory = categories.find(cat => cat._id === value)

	const handleSelect = (category: (typeof categories)[0]) => {
		onChange(category._id, category.name, category.slug)
		setIsOpen(false)
	}

	return (
		<div className='relative'>
			<label className='block text-sm font-medium mb-2'>
				Категория статьи <span className='text-danger'>*</span>
			</label>

			<div className='relative'>
				<button
					type='button'
					onClick={() => setIsOpen(!isOpen)}
					className='w-full px-3 py-2.5 bg-card border border-border rounded focus:outline-none focus:ring-3 focus:ring-brand/20 focus:border-brand duration-300 text-left flex justify-between items-center'
				>
					<span
						className={
							selectedCategory
								? 'text-foreground'
								: 'text-muted-foreground'
						}
					>
						{selectedCategory
							? selectedCategory.name
							: 'Выберите категорию'}
					</span>
					<ChevronDown
						className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
					/>
				</button>

				{isOpen && (
					<div className='absolute z-10 mt-1 w-full bg-card border border-border rounded shadow-lg max-h-60 overflow-auto'>
						{categories.map(category => (
							<button
								key={category._id}
								type='button'
								onClick={() => handleSelect(category)}
								className='w-full px-3 py-2 text-left hover:bg-surface-hover flex items-center justify-between'
							>
								<span>{category.name}</span>
								{value === category._id && (
									<Check className='w-4 h-4 text-brand' />
								)}
							</button>
						))}
					</div>
				)}
			</div>

			{isOpen && (
				<div
					className='fixed inset-0 z-0'
					onClick={() => setIsOpen(false)}
				/>
			)}
			{selectedCategory && (
				<div className='mt-2 text-sm text-muted-foreground'>
					<p>
						Slug категории:{' '}
						<code className='bg-surface-subtle px-1 rounded'>
							{selectedCategory.slug}
						</code>
					</p>
					<p className='text-xs text-muted-foreground mt-1'>
						URL статьи будет: /blog/{selectedCategory.slug}
						/[slug-статьи]
					</p>
				</div>
			)}
		</div>
	)
}
