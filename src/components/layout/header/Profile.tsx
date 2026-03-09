import IconLogin from '@/components/svg/IconLogin'
import { ThemeToggle } from '@/components/ui/theme/ThemeToggle'
import Link from 'next/link'

const Profile = () => {
	const user = false

	const linkProps = user
		? { href: '/logout', text: 'Выйти' }
		: { href: '/login', text: 'Войти' }

	return (
		<div className='flex items-center'>
			<Link
				href={linkProps.href}
				className='ml-6 w-10 xl:w-28 flex justify-center items-center gap-x-2 p-2 rounded text-white text-base bg-[#ff6633] hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) duration-300'
			>
				<span className='justify-center hidden xl:flex'>
					{linkProps.text}
				</span>
				<IconLogin isLoggedIn={user} />
			</Link>
			<ThemeToggle />
		</div>
	)
}

export default Profile
