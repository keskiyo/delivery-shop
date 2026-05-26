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
		<nav aria-label='Основное меню' className='lg:shrink-0'>
			<div className='h-16 lg:h-auto fixed bottom-0 left-0 right-0 lg:static flex flex-row items-center justify-between lg:justify-start lg:gap-6 w-full lg:w-auto px-4 lg:px-0 py-2 lg:py-0 shadow-(--shadow-default) lg:shadow-none text-[8px] lg:text-[12px] z-50 bg-site-chrome'>
				<TopMenu />

				<div className='flex items-center gap-3 shrink-0'>
					<Profile />
				</div>
			</div>
		</nav>
	)
}

export default UserBlock
