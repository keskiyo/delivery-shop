import { Loader } from '@/components/features/common/loader'
import HighlightText from '@/components/layout/header/HighlightText'
import { SearchProduct } from '@/types/searchProduct'
import { TRANSLATIONS } from '@/utils/translations'
import { Menu } from 'lucide-react'
import Link from 'next/link'
const SearchResults = ({
	isLoading,
	groupedProducts,
	query,
	resetSearch,
}: {
	isLoading: boolean
	groupedProducts: { category: string; products: SearchProduct[] }[]
	query: string
	resetSearch: () => void
}) => {
	if (isLoading) return <Loader />

	if (groupedProducts.length > 0) {
		return (
			<div className='flex flex-col gap-2 p-2'>
				{groupedProducts.map(group => (
					<div key={group.category} className='flex flex-col gap-2'>
						<Link
							href={`/category/${encodeURIComponent(group.category)}`}
							className='flex items-start gap-x-4 hoverLbg-gray-100 p-1 rounded cursor-pointer'
							onClick={resetSearch}
						>
							<div>
								<HighlightText
									text={
										TRANSLATIONS[group.category] ||
										group.category
									}
									highlight={query}
								/>
							</div>
							<Menu size={24} className='text-gray-500' />
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
		)
	}
	if (query.length > 2)
		return <div className='py-2 px-4'>Ничего не нашлось</div>

	return <div className='p-4'>Введите 3 или более символов для поиска</div>
}

export default SearchResults
