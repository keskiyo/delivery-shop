/**
 * Блок пользователя в header (правая часть)
 * 
 * Содержит:
 * - TopMenu: навигация (каталог, акции, контакты, доставка)
 * - Profile: профиль пользователя, корзина, избранное
 * 
 * Адаптивность:
 * - Мобильный: фиксированная панель внизу экрана (bottom-0)
 * - Десктоп: статичное положение справа в header
 * 
 * Используется в:
 * - components/layout/header/Header.tsx
 */
import Profile from './Profile'
import TopMenu from './TopMenu'

const UserBlock = () => {
	return (
		<nav aria-label='Основное меню'>
			<div className='h-16 md:h-auto fixed bottom-0 left-0 right-0 md:static flex flex-row justify-between items-center w-full px-4 py-2 shadow-(--shadow-default) md:shadow-none text-[8px] md:text-[12px] z-50 bg-[#353535]'>
				<TopMenu />
				<Profile />
			</div>
		</nav>
	)
}

export default UserBlock
