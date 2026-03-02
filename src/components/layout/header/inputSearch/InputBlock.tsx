'use client'

import SearchInput from '@/components/layout/header/inputSearch/SearchInput'
import SearchResults from '@/components/layout/header/inputSearch/SearchResults'
import { SearchProduct } from '@/types/searchProduct'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const InputBlock = ({
	onFocusChangeAction,
}: {
	onFocusChangeAction: (focused: boolean) => void
}) => {
	const router = useRouter()
	const [isOpen, setIsOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [groupedProducts, setGroupedProducts] = useState<
		{ category: string; products: SearchProduct[] }[]
	>([])
	const searchRef = useRef<HTMLDivElement>(null)
	const [error, setError] = useState<string | null>(null)

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
					setError('Не найдена категория или продукт:')
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
		onFocusChangeAction(true)
	}

	const resetSearch = () => {
		setQuery('')
		setIsOpen(false)
	}

	const handleSearch = () => {
		if (query.trim()) {
			router.push(`/search?query=${encodeURIComponent(query)}`)
			resetSearch()
		}
	}

	const handleInputBlur = () => {
		onFocusChangeAction(false)
	}
	return (
		<div
			className='relative min-w-65.25 grow text-gray-900'
			ref={searchRef}
		>
			<SearchInput
				query={query}
				setQuery={setQuery}
				handleSearch={handleSearch}
				handleInputFocus={handleInputFocus}
				handleInputBlur={handleInputBlur}
			/>
			{isOpen && (
				<div className='absolute -mt-0.5 left-0 right-0 z-100 max-h-75 overflow-y-auto bg-white rounded-b border border-gray-300 border-t-0 wrap-break-word'>
					{error ? (
						<div className='p-2 text-red-500 text-sm'>
							{error}{' '}
							<button
								onClick={() => setError(null)}
								className='text-blue-600 hover:text-blue-500 cursor-pointer flex items-center'
							>
								Попробовать снова
							</button>
						</div>
					) : (
						<SearchResults
							groupedProducts={groupedProducts}
							isLoading={isLoading}
							query={query}
							resetSearch={resetSearch}
						/>
					)}
				</div>
			)}
		</div>
	)
}

export default InputBlock
