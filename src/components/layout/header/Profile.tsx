'use client'

import { Loader } from '@/components/features/common/loader'
import { ThemeToggle } from '@/components/ui/theme/ThemeToggle'
import { useAuthStore } from '@/store/authStore'
import { LogIn } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { checkAvatarExist } from '../../../../utils/avatarUtils'
import { getAvatarByGender } from '../../../../utils/getAvatar'

const Profile = () => {
	const { isAuth, user, logout, checkAuth, isLoading } = useAuthStore()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isLoggingOut, setIsLoggingOut] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	const [avatarSrc, setAvatarSrc] = useState<string>('')
	const [lastUpdate, setLastUpdate] = useState(Date.now())
	const menuRef = useRef<HTMLDivElement>(null)
	const router = useRouter()

	const getDisplayName = () => {
		if (!user?.name) return <Loader />

		if (user.role === 'manager') {
			return 'Менеджер'
		} else if (user.role === 'admin') {
			return 'Администратор'
		}

		return user.name
	}

	const isManagerOrAdmin = () => {
		return user?.role === 'manager' || user?.role === 'admin'
	}

	useEffect(() => {
		setLastUpdate(Date.now())
	}, [user])

	useEffect(() => {
		const checkAvatar = async () => {
			if (user?.id) {
				try {
					const exists = await checkAvatarExist(user.id)

					if (exists) {
						setAvatarSrc(
							`/api/auth/avatar/${user.id}?t=${lastUpdate}`,
						)
					} else {
						setAvatarSrc(getAvatarByGender(user.gender))
					}
				} catch {
					setAvatarSrc(getAvatarByGender(user.gender))
				}
			} else if (user?.gender) {
				setAvatarSrc(getAvatarByGender(user.gender))
			}
		}

		checkAvatar()
	}, [user, lastUpdate])

	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth <= 768)
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setIsMenuOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

	const handleLogout = async () => {
		setIsLoggingOut(true)
		try {
			await logout()

			router.replace('/')
		} catch (error) {
			console.error('Не удалось выйти:', error)
		} finally {
			setIsLoggingOut(false)
			setIsMenuOpen(false)
		}
	}

	const handleAvatarError = () => {
		if (user?.gender) {
			setAvatarSrc(getAvatarByGender(user?.gender))
		}
	}

	if (isLoading) {
		return (
			<div className='ml-6 w-10 h-10 rounded-full bg-gray-200 animate-pulse'></div>
		)
	}

	if (!isAuth) {
		return (
			<>
				<Link
					href='/login'
					className='ml-6 w-10 xl:w-39.25 flex justify-between items-center gap-x-2 p-2 rounded text-white text-base bg-[#ff6633] hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) duration-300 cursor-pointer'
				>
					<div className='w-27.25 justify-center hidden xl:flex'>
						<p>Войти</p>
					</div>
					<LogIn size={24} />
				</Link>
				<ThemeToggle />
			</>
		)
	}

	return (
		<>
			<div className='relative ml-6' ref={menuRef}>
				<div
					className='flex items-center gap-2.5 cursor-pointer'
					onClick={toggleMenu}
				>
					<Image
						src={avatarSrc || getAvatarByGender(user?.gender)}
						alt='Ваш профиль'
						width={40}
						height={40}
						onError={handleAvatarError}
						className='min-w-10 min-h-10 md:block xl:block rounded-full object-cover'
					/>
					<p className='hidden xl:block text-base cursor-pointer p-2.5'>
						{getDisplayName()}
					</p>
				</div>

				{/* Выпадающее меню */}
				<div
					className={`absolute right-0 bg-[#353535] rounded shadow-button-secondary overflow-hidden flex flex-col items-center z-50 ${
						isMenuOpen
							? 'opacity-100 translate-y-0'
							: 'opacity-0 -translate-y-2 pointer-events-none'
					} transition-all duration-300 min-w-40 ${
						isMobile ? 'bottom-full top-auto mb-6' : 'top-full mt-6'
					}`}
				>
					<Link
						href='/user-profile'
						className='block px-4 py-3 text-gray-300 hover:text-[#ff6633] duration-300'
						onClick={() => setIsMenuOpen(false)}
					>
						Профиль
					</Link>
					<Link
						href='/'
						className='block px-4 py-3 text-gray-300 hover:text-[#ff6633] duration-300'
						onClick={() => setIsMenuOpen(false)}
					>
						Главная
					</Link>
					{isManagerOrAdmin() && (
						<Link
							href='/administrator'
							className='block px-4 py-3 text-gray-300 hover:text-[#ff6633] duration-300'
							onClick={() => setIsMenuOpen(false)}
						>
							Панель управления
						</Link>
					)}
					<ThemeToggle />
					<button
						onClick={handleLogout}
						disabled={isLoggingOut}
						className='w-full text-center px-4 py-3 text-gray-300 hover:text-[#ff6633] duration-300 border-t border-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{isLoggingOut ? 'Выход...' : 'Выйти'}
					</button>
				</div>
			</div>
		</>
	)
}

export default Profile
