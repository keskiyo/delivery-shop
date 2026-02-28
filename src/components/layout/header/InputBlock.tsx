'use client'

import { Loader } from '@/components/features/common/loader'
import HighlightText from '@/components/layout/header/HighlightText'
import { SearchProduct } from '@/types/searchProduct'
import { TRANSLATIONS } from '@/utils/translations'
import { Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const InputBlock = () => {
	const router = useRouter()
	const [isOpen, setIsOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [groupedProducts, setGroupedProducts] = useState<
		{ category: string; products: SearchProduct[] }[]
	>([])
	const searchRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		const fetchSearchData = async () => {
			if (query.length > 2) {
				try {
					setIsLoading(true)
					const response = await fetch(`/api/search?query=${query}`)
					const data = await response.json()
					setGroupedProducts(data)
				} catch (error) {
					console.error('Не найдена категория или продукт:', error)
				} finally {
					setIsLoading(false)
				}
			} else {
				setGroupedProducts([])
			}
		}
		const debounceTimer = setTimeout(fetchSearchData, 500)
		return () => clearTimeout(debounceTimer)
	}, [query])

	const handleInputFocus = () => {
		setIsOpen(true)
	}

	const resetSearch = () => {
		setQuery('')
		setIsOpen(false)
	}

	const handleSearch = () => {
		if (query.trim()) {
			router.push(`/search?query=${encodeURIComponent(query)}`)
			setIsOpen(false)
		}
	}
	return (
		<div
			className='relative min-w-65.25 grow text-gray-900'
			ref={searchRef}
		>
			<div className='relative rounded border border-gray-300 leading-[150%]'>
				<form
					onSubmit={e => {
						e.preventDefault()
						handleSearch()
					}}
				>
					<input
						type='text'
						value={query}
						placeholder='Найти продукт'
						className='w-full h-10  p-2 outline-none bg-white text-base'
						onFocus={handleInputFocus}
						onChange={e => setQuery(e.target.value)}
					/>
					<button
						className='absolute top-2 right-2 w-6 h-6 cursor-pointer'
						type='submit'
					>
						<Search size={24} />
					</button>
				</form>
			</div>
			{isOpen && (
				<div className='absolute -mt-0.5 left-0 right-0 z-100 max-h-75 overflow-y-auto bg-white rounded-b border border-gray-300 border-t-0 wrap-break-word'>
					{isLoading ? (
						<Loader />
					) : groupedProducts.length > 0 ? (
						<div className='flex flex-col gap-2 p-2'>
							{groupedProducts.map(group => (
								<div
									key={group.category}
									className='flex flex-col gap-2'
								>
									<Link
										href={`/category/${encodeURIComponent(
											group.category,
										)}`}
										className='flex items-start gap-x-4 hoverLbg-gray-100 p-1 rounded cursor-pointer'
										onClick={resetSearch}
									>
										<div>
											<HighlightText
												text={
													TRANSLATIONS[
														group.category
													] || group.category
												}
												highlight={query}
											/>
										</div>
										<Menu
											size={24}
											className='text-gray-500'
										/>
									</Link>
									<ul className='flex flex-col gap-2'>
										{group.products.map(product => (
											<li
												key={product.id}
												className='p-1 hover:bg-gray-100'
											>
												<Link
													href={`/product/${product.id}`}
													className='cursor-pointer'
													onClick={resetSearch}
												>
													<HighlightText
														text={product.title}
														highlight={query}
													/>
												</Link>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					) : query.length > 2 ? (
						<div className='py-2 px-4'>Ничего не нашлось</div>
					) : (
						<div className='p-4'>
							Введите 3 или более символов для поиска
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default InputBlock
