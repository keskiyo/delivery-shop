'use client'

import { PATH_TRANSLATIONS } from '@/utils/pathTranslations'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BreadCrumbs = () => {
	const pathname = usePathname()

	if (pathname === '/') return null

	const pathSegments = pathname.split('/').filter(segment => segment !== '')

	const breadcrumbs = pathSegments.map((segment, index) => {
		const href = '/' + pathSegments.slice(0, index + 1).join('/')
		return {
			label: PATH_TRANSLATIONS[segment] || segment,
			href,
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
			<ol className='flex items-center gap-4 text-[8px] md:text-xs'>
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
