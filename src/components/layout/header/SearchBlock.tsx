/**
 * Блок поиска в header
 *
 * Содержит:
 * - Кнопка "Каталог" (только на десктопе, md и выше)
 * - Поле ввода поиска (InputBlock)
 *
 * Адаптивность:
 * - Мобильная: только поле поиска
 * - Десктоп: кнопка каталога + поле поиска
 *
 * Используется в:
 * - CatalogMenu.tsx (внутри выпадающего меню)
 */
import InputBlock from '@/components/layout/header/inputSearch/InputBlock'
import { Menu } from 'lucide-react'
import Link from 'next/link'

const SearchBlock = ({
	onFocusChangeAction,
}: {
	onFocusChangeAction: (focused: boolean) => void
}) => {
	return (
		<div className='flex flex-row gap-4 items-center grow text-white'>
			<Link
				href='/catalog'
				className='hidden md:flex w-auto min-w-18 px-3 py-2 gap-2 items-center shrink-0 rounded transition-colors cursor-pointer bg-orange-500 hover:bg-orange-400'
			>
				<Menu size={24} />
				<span className='text-base hidden lg:block'>Каталог</span>
			</Link>

			<InputBlock onFocusChangeAction={onFocusChangeAction} />
		</div>
	)
}

export default SearchBlock
