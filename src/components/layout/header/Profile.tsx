import { ThemeToggle } from '@/components/ui/theme/ThemeToggle'
import { ChevronDown, CircleUserRound } from 'lucide-react'

const Profile = () => {
	return (
		<div className='ml-6 p-2 flex flex-1 justify-end items-center gap-2'>
			<CircleUserRound size={40} />
			<p className='hidden xl:block cursor-pointer'>Максим</p>
			<button className='hidden xl:block cursor-pointer p-2'>
				<ChevronDown size={24} />
			</button>
			<span className='text-gray-400 text-[35px] pb-2'>|</span>
			<ThemeToggle />
		</div>
	)
}

export default Profile

{
	/* <ChevronUp /> стрелочка вверх для стиля */
}
