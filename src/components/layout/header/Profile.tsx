import { ThemeToggle } from '@/components/ui/theme/ThemeToggle'
import { ChevronDown, CircleUserRound } from 'lucide-react'

const Profile = () => {
	return (
		<div className='ml-6 p-2 flex flex-1 justify-end items-center gap-2'>
			<CircleUserRound size={28} />
			<p className='hidden xl:block cursor-pointer'>Максим</p>
			<button className='hidden xl:block cursor-pointer p-2'>
				<ChevronDown size={18} />
			</button>
			<div className='hidden xl:block w-0.5 h-6 bg-gray-300 mx-2'>|</div>
			<ThemeToggle />
		</div>
	)
}

export default Profile

{
	/* <ChevronUp /> стрелочка вверх для стиля */
}
