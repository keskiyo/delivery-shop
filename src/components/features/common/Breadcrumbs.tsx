'use client'

import { useArticleTitles } from '@/app/contexts/ArticleContext'
import { useCategoryTitles } from '@/app/contexts/CategoryContext'
import { useProduct } from '@/app/contexts/ProductContext'
import { Loader } from '@/components/features/common/loader'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import { TRANSLATIONS } from '../../../../utils/translations'

function BreadcrumbsContent() {
	const pathname = usePathname()
	const { title } = useProduct()
	const { articleTitle } = useArticleTitles()
	const { categoryTitle } = useCategoryTitles()

	if (pathname === '/' || pathname === '/search') return null

	const pathSegments = pathname.split('/').filter(segment => segment !== '')

	const productDesc = title

	const isArticlePage = pathSegments[0] === 'blog' && pathSegments.length >= 3
	const isCategoryPage =
		pathSegments[0] === 'blog' && pathSegments.length >= 2

	const breadcrumbs = pathSegments.map((segment, index) => {
		const href = '/' + pathSegments.slice(0, index + 1).join('/')

		let label = TRANSLATIONS[segment] || segment

		if (
			index === pathSegments.length - 1 &&
			productDesc &&
			pathSegments.includes('catalog') &&
			pathSegments.length >= 3
		) {
			label = productDesc
		}

		if (
			isCategoryPage &&
			index === pathSegments.length - 1 &&
			categoryTitle
		) {
			label = categoryTitle
		}

		if (
			isArticlePage &&
			index === pathSegments.length - 2 &&
			categoryTitle
		) {
			label = categoryTitle
		}

		if (
			isArticlePage &&
			index === pathSegments.length - 1 &&
			articleTitle
		) {
			label = articleTitle
		}

		let finalHref = href
		const isLastItem = index === pathSegments.length - 1
		const isBlogPage = isArticlePage || isCategoryPage

		if (isLastItem && !isBlogPage) {
			finalHref = `${href}?desc=${productDesc}`
		}

		return {
			label,
			href: finalHref,
			isLast: isLastItem,
		}
	})

	breadcrumbs.unshift({
		label: 'Главная',
		href: '/',
		isLast: false,
	})

	return (
		<nav className='px-[max(12px,calc((100%_-_1208px)/2))] my-6'>
			<ol className='flex flex-wrap items-center gap-4 text-[10px] md:text-xs'>
				{breadcrumbs.map((item, index) => (
					<li key={index} className='flex items-center gap-4 text-xs'>
						<div
							className={
								item.isLast
									? 'text-breadcrumb-muted '
									: 'text-breadcrumb-default hover:underline cursor-pointer dark:text-white'
							}
						>
							{item.isLast ? (
								<span title={item.label}>{item.label}</span>
							) : (
								<Link href={item.href}>
									<span title={item.label}>{item.label}</span>
								</Link>
							)}
						</div>
						{!item.isLast && <ChevronRight size={24} />}
					</li>
				))}
			</ol>
		</nav>
	)
}

const Breadcrumbs = () => {
	return (
		<Suspense
			fallback={
				<nav className='px-[max(12px,calc((100%_-_1208px)/2))] my-6'>
					<Loader />
				</nav>
			}
		>
			<BreadcrumbsContent />
		</Suspense>
	)
}

export default Breadcrumbs
