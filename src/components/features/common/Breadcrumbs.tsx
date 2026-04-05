'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { TRANSLATIONS } from '../../../../utils/translations'

const BreadCrumbs = () => {
	const pathname = usePathname()

	if (pathname === '/' || pathname === '/search') return null

	const pathSegments = pathname.split('/').filter(segment => segment !== '')

	const searchParams = useSearchParams()
	const productsDesc = searchParams.get('desc')

	const breadcrumbs = pathSegments.map((segment, index) => {
		const href = '/' + pathSegments.slice(0, index + 1).join('/')

		let label = TRANSLATIONS[segment] || segment

		if (
			index === pathSegments.length - 1 &&
			productsDesc &&
			pathSegments.includes('catalog') &&
			pathSegments.length >= 3
		) {
			label = productsDesc
		}

		return {
			label,
			href:
				index === pathSegments.length - 1
					? `${href}?desc=${productsDesc}`
					: href,
			isLast: index === pathSegments.length - 1,
		}
	})

	breadcrumbs.unshift({
		label: 'Главная',
		href: '/',
		isLast: false,
	})

	return (
		<nav className='px-[max(12px,calc((100%-1208px)/2))] my-6'>
			<ol className='flex items-center gap-4 text-[10px] md:text-xs'>
				{breadcrumbs.map((item, index) => (
					<li key={index} className='flex items-center gap-4'>
						<div
							className={
								item.isLast
									? 'text-breadcrumb-muted '
									: 'text-breadcrumb-default hover:underline cursor-pointer dark:text-white'
							}
						>
							{item.isLast ? (
								item.label
							) : (
								<Link href={item.href}>{item.label}</Link>
							)}
						</div>
						{!item.isLast && <ChevronRight size={22} />}
					</li>
				))}
			</ol>
		</nav>
	)
}

export default BreadCrumbs
