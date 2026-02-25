import Profile from './Profile'
import TopMenu from './TopMenu'

const UserBlock = () => {
	return (
		<nav aria-label='Основное меню'>
			<div className='h-16 md:h-auto fixed bottom-0 left-0 right-0 md:static flex flex-row justify-between items-center w-full px-4 py-2 shadow-(--shadow-default) md:shadow-none text-[8px] md:text-[12px] z-50 bg-[#242525]'>
				<TopMenu />
				<Profile />
			</div>
		</nav>
	)
}

export default UserBlock
