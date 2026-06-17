import ErrorComponent from '@/components/features/common/ErrorComponent'
import { Loader } from '@/components/features/common/loader'
import SearchBlock from '@/components/layout/header/SearchBlock'
import { Category } from '@/types/categories'
import { ErrorProps } from '@/types/errorProps'
import Link from 'next/link'
import { RefObject } from 'react'

const CatalogMenu = ({
	onMouseEnter,
	searchBlockRef,
	menuRef,
	categories,
	isLoading,
	error,
	isCatalogOpen,
	onFocusChangeAction,
	setIsCatalogOpen,
}: {
	isLoading: boolean
	isCatalogOpen: boolean
	setIsCatalogOpen: (open: boolean) => void
	categories: Category[]
	searchBlockRef: RefObject<HTMLDivElement | null>
	menuRef: RefObject<HTMLDivElement | null>
	error: ErrorProps | null
	onMouseEnter: () => void
	onFocusChangeAction: (focused: boolean) => void
}) => {
	return (
		<>
			<div
				className='flex items-center w-full'
				onMouseEnter={onMouseEnter}
				ref={searchBlockRef}
			>
				<SearchBlock onFocusChangeAction={onFocusChangeAction} />
			</div>

			{isCatalogOpen && (
				<div
					className='hidden md:block absolute top-full left-0 w-full bg-site-chrome z-50 shadow-category-block'
					ref={menuRef}
				>
					<div className='px-4 py-3 mx-auto'>
						{error && (
							<ErrorComponent
								error={error.error}
								userMessage={error.userMessage}
							/>
						)}
						{isLoading ? (
							<Loader />
						) : categories.length > 0 ? (
							<div className='grid grid-cols-2 xl-grid-cols-4 gap-6'>
								{categories.map(category => (
									<Link
										key={category.slug}
										href={`/catalog/${category.slug}`}
										className='block px-4 py-2 text-site-chrome-muted hover:text-promo font-bold transition-custom hover:border-b hover:border-promo border-b border-site-chrome'
										onClick={() => setIsCatalogOpen(false)}
									>
										{category.title}
									</Link>
								))}
							</div>
						) : (
							!isLoading && (
								<p className='py-2 text-center'>
									Категории не найдены
								</p>
							)
						)}
					</div>
				</div>
			)}
		</>
	)
}

export default CatalogMenu
