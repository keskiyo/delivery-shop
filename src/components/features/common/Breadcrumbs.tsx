'use client'

import { useProduct } from '@/app/contexts/ProductContext'
import { Loader } from '@/components/features/common/loader'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import { TRANSLATIONS } from '../../../../utils/translations'

/**
 * Компонент хлебных крошек (навигационная цепочка)
 *
 * Функционал:
 * - Автоматически генерирует навигационную цепочку на основе URL
 * - Переводит сегменты URL на русский язык через TRANSLATIONS
 * - Для страниц товаров показывает название товара из query параметра 'desc'
 * - Скрывается на главной странице и странице поиска
 * - Использует Suspense для предотвращения ошибок гидратации
 *
 * @example
 * URL: /catalog/meat/product-123?desc=Говядина
 * Результат: Главная > Каталог > Мясо > Говядина
 */
function BreadcrumbsContent() {
	const pathname = usePathname()
	const { title } = useProduct()

	if (pathname === '/' || pathname === '/search') return null

	const pathSegments = pathname.split('/').filter(segment => segment !== '')

	const productDesc = title

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

		return {
			label,
			href:
				index === pathSegments.length - 1
					? `${href}?desc=${productDesc}`
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
				<nav className='px-[max(12px,calc((100%-1208px)/2))] my-6'>
					<Loader />
				</nav>
			}
		>
			<BreadcrumbsContent />
		</Suspense>
	)
}

export default Breadcrumbs
