'use client'

import Article from '@/app/(root)/(admin)/administrator/products/add-product/_components/Article'
import BasePrice from '@/app/(root)/(admin)/administrator/products/add-product/_components/BasePrice'
import Brand from '@/app/(root)/(admin)/administrator/products/add-product/_components/Brand'
import Categories from '@/app/(root)/(admin)/administrator/products/add-product/_components/Categories'
import CheckboxGroup from '@/app/(root)/(admin)/administrator/products/add-product/_components/CheckboxGroup'
import Description from '@/app/(root)/(admin)/administrator/products/add-product/_components/Description'
import Discount from '@/app/(root)/(admin)/administrator/products/add-product/_components/Discount'
import ImageUploadSection from '@/app/(root)/(admin)/administrator/products/add-product/_components/ImageUploadSection'
import Manufacturer from '@/app/(root)/(admin)/administrator/products/add-product/_components/Manufacturer'
import Quantity from '@/app/(root)/(admin)/administrator/products/add-product/_components/Quantity'
import SuccessCreatedMessage from '@/app/(root)/(admin)/administrator/products/add-product/_components/SuccessCreatedMessage'
import Tags from '@/app/(root)/(admin)/administrator/products/add-product/_components/Tags'
import Title from '@/app/(root)/(admin)/administrator/products/add-product/_components/Title'
import Weight from '@/app/(root)/(admin)/administrator/products/add-product/_components/Weight'
import { initialProductData } from '@/constants/addProductFormData'
import {
	AddProductApiResponse,
	AddProductFormData,
	ImageUploadResponse,
} from '@/types/addProductTypes'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ChangeEvent, SyntheticEvent, useCallback, useState } from 'react'
export default function AddProductPage() {
	const [formData, setFormData] =
		useState<AddProductFormData>(initialProductData)
	const [uploading, setUploading] = useState(false)
	const [loading, setLoading] = useState(false)
	const [image, setImage] = useState<File | null>(null)
	const [createdProductId, setCreatedProductId] = useState<number | null>(
		null,
	)

	const generateProductId = useCallback(() => {
		return Math.floor(Math.random() * 1000000000000000)
	}, [])

	const uploadImage = async (
		imageFile: File | null,
		id: number | null,
	): Promise<{ img: string; id: number } | null> => {
		if (!imageFile || !id) return null

		setUploading(true)

		const formData = new FormData()
		formData.append('image', imageFile)
		formData.append('imageId', id.toString())

		try {
			const response = await fetch('/api/upload-image', {
				method: 'POST',
				body: formData,
			})

			const data: ImageUploadResponse = await response.json()

			if (data.success && data.product) {
				return { img: data.product.img, id: data.product.id }
			}

			return null
		} catch (error) {
			console.error('Ошибка загрузки изображения:', error)
			return null
		} finally {
			setUploading(false)
		}
	}

	const hasActionsTag = formData.tags.includes('actions')

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault()
		if (
			hasActionsTag &&
			(!formData.discountPercent || formData.discountPercent === '0')
		) {
			alert(
				"Для товара с тегом 'Акции' обязательно укажите размер скидки",
			)
			return
		}

		setLoading(true)

		try {
			const productId = generateProductId()

			let imagePath: string | null = null

			if (image) {
				const uploadResult = await uploadImage(image, productId)
				if (uploadResult) {
					imagePath = uploadResult.img
				} else {
					alert('Ошибка загрузки изображения')
					setLoading(false)
					return
				}
			}

			const response = await fetch('/api/add-product', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					img: imagePath,
					id: productId,
					basePrice: Number(formData.basePrice),
					discountPercent: Number(formData.discountPercent),
					weight: Number(formData.weight),
					quantity: Number(formData.quantity),
					isHealthyFood: formData.isHealthyFood,
					isNonGMO: formData.isNonGMO,
				}),
			})

			const result: AddProductApiResponse = await response.json()

			if (response.ok && result.success) {
				setCreatedProductId(productId)
			}
		} catch (error) {
			alert(
				'Ошибка: ' +
					(error instanceof Error
						? error.message
						: 'Неизвестная ошибка'),
			)
		} finally {
			setLoading(false)
		}
	}

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value, type } = e.target
		setFormData(prev => ({
			...prev,
			[name]:
				type === 'checkbox'
					? (e.target as HTMLInputElement).checked
					: value,
		}))
	}

	const handleTagsChange = (tags: string[]) => {
		setFormData(prev => ({ ...prev, tags }))
	}

	const handleImageChange = (file: File | null) => {
		setImage(file)
	}

	const clearForm = () => {
		setFormData(initialProductData)
		setImage(null)
		setCreatedProductId(null)
	}

	return (
		<div className='container flex flex-col items-center px-4 py-8 mx-auto'>
			<Link
				href='/administrator'
				className='hover:underline mb-3 lg:mb-4 flex flex-row items-center gap-3 text-sm lg:text-base'
			>
				<ArrowLeft className='h-4 w-4 ml-1' />
				Назад в панель управления
			</Link>
			<h1 className='text-3xl font-bold mb-8'>Добавить товар</h1>

			<form
				onSubmit={handleSubmit}
				className='max-w-2xl space-y-6 w-full'
			>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Title
						onChangeAction={handleInputChange}
						title={formData.title}
					/>
					<Article
						onChangeAction={handleInputChange}
						article={formData.article}
					/>
				</div>
				<Description
					onChangeAction={handleInputChange}
					description={formData.description}
				/>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<BasePrice
						onChangeAction={handleInputChange}
						basePrice={formData.basePrice}
					/>
					<Discount
						onChangeAction={handleInputChange}
						discount={formData.discountPercent}
						required={hasActionsTag}
					/>
					<Quantity
						onChangeAction={handleInputChange}
						quantity={formData.quantity}
					/>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<Weight
						onChangeAction={handleInputChange}
						weight={formData.weight}
					/>
					<Brand
						onChangeAction={handleInputChange}
						brand={formData.brand}
					/>
					<Manufacturer
						onChangeAction={handleInputChange}
						manufacturer={formData.manufacturer}
					/>
				</div>
				<Categories
					selectedCategories={formData.categories}
					onCategoriesChange={categories =>
						setFormData(prev => ({ ...prev, categories }))
					}
				/>
				<Tags
					selectedTags={formData.tags}
					onTagsChange={handleTagsChange}
					hasActionsTag={hasActionsTag}
				/>
				<CheckboxGroup
					items={[
						{
							name: 'isHealthyFood',
							label: 'Здоровая еда',
							checked: formData.isHealthyFood,
						},
						{
							name: 'isNonGMO',
							label: 'Без ГМО',
							checked: formData.isNonGMO,
						},
					]}
					onChange={handleInputChange}
				/>
				<ImageUploadSection
					onImageChange={handleImageChange}
					uploading={uploading}
					loading={loading}
				/>
				<button
					type='submit'
					disabled={loading || uploading}
					className='w-full bg-green-600 hover:shadow-button-default active:shadow-button-active text-white py-3 px-4 mb-5 rounded disabled:opacity-50 cursor-pointer'
				>
					{loading ? 'Добавление...' : 'Добавить товар'}
				</button>
			</form>
			{createdProductId && (
				<SuccessCreatedMessage
					categories={formData.categories}
					createdProductId={createdProductId}
					onClearForm={clearForm}
				/>
			)}
		</div>
	)
}
