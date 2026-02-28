'use client'

import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import Loading from '@/components/ui/loading'
import { ProductCardProps } from '@/types/product'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const SearchResult = () => {
	const searchParams = useSearchParams()
	const query = searchParams.get('query') || ''
	const [products, setProducts] = useState<ProductCardProps[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchSearchResults = async () => {
			try {
				setIsLoading(true)
				const response = await fetch(
					`/api/search-full?query=${encodeURIComponent(query)}`,
				)
				const data = await response.json()
				setProducts(data)
			} catch (error) {
				console.error('Не найдена категория или продукт:', error)
			} finally {
				setIsLoading(false)
			}
		}
		if (query) fetchSearchResults()
	}, [query])

	if (isLoading) return <Loading />

	return (
		<div className='px-[max(12px,calc((100%-1208px)/2))] my-20 '>
			<h1 className='text-2xl xl:text-4xl text-left font-bold mb-6'>
				Результаты поиска:
			</h1>
			<p className='text-sm md:text-base xl:text-2xl mb-6'>
				по запросу:
				<span className='text-orange-500 font-bold border-b-3 border-orange-500'>
					{query}
				</span>
			</p>
			{products.length === 0 ? (
				<p className='text-lg'>Ничего не нашлось</p>
			) : (
				<ProductsSections title={''} products={products} />
			)}
		</div>
	)
}

export default SearchResult
