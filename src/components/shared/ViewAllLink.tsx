import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

/**
 * Компонент ссылки "Смотреть все" с иконкой стрелки
 * 
 * Используется для перехода на страницу с полным списком (категории, статьи, товары)
 * Отображает текст и стрелку вправо
 * 
 * @param btnText - Текст ссылки (например, "Смотреть все")
 * @param href - URL для перехода
 * 
 * @example
 * <ViewAllLink btnText="Смотреть все" href="/catalog/meat" />
 */
const ViewAllLink = ({ btnText, href }: { btnText: string; href: string }) => {
	return (
		<Link
			href={href}
			className='flex flex-row items-center gap-x-2 cursor-pointer'
		>
			<p className='text-base text-center'>{btnText}</p>
			<ChevronRight size={24} />
		</Link>
	)
}

export default ViewAllLink
