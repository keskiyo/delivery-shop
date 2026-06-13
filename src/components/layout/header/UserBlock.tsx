
import { ThemeToggle } from '@/components/ui/theme/ThemeToggle'
import Profile from './Profile'
import TopMenu from './TopMenu'

const UserBlock = () => {
	return (
		<nav aria-label='Основное меню' className='lg:shrink-0'>
			<div className='fixed bottom-0 left-0 right-0 z-50 flex h-17 w-full flex-row items-center justify-between bg-site-chrome px-4 py-2 text-[10px] shadow-(--shadow-default) sm:text-xs lg:static lg:h-auto lg:w-auto lg:justify-start lg:gap-6 lg:px-0 lg:py-0 lg:text-[12px] lg:shadow-none'>
				<TopMenu />

				<div className='flex items-center gap-3 shrink-0'>
					<ThemeToggle variant='mobileDropdown' />
					<Profile />
				</div>
			</div>
		</nav>
	)
}

export default UserBlock
