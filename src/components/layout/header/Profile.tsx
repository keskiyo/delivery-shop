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
	const [lastUpdate, setLastUpdate] = useState(() => Date.now())
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
						setAvatarSrc(`/api/auth/avatar/${user.id}`)
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
			<div className='w-10 h-10 rounded-full bg-surface-hover animate-pulse'></div>
		)
	}

	return (
		<>
			{!isAuth ? (
				<div className='relative flex items-center gap-3'>
					<ThemeToggle variant='notAuth' />

					<Link
						href='/login'
						className='flex items-center justify-between w-10 p-2 text-base text-white rounded cursor-pointer xl:w-30 gap-x-2 bg-promo hover:bg-promo-hover hover:shadow-article active:shadow-button-active transition-custom'
					>
						<div className='justify-center hidden w-27 xl:flex'>
							<p>Войти</p>
						</div>

						<LogIn size={24} />
					</Link>
				</div>
			) : (
				<div
					className='relative text-site-chrome-foreground'
					ref={menuRef}
				>
					<div
						className='flex items-center gap-2 cursor-pointer'
						onClick={toggleMenu}
					>
						<Image
							src={avatarSrc || getAvatarByGender(user?.gender)}
							alt='Ваш профиль'
							width={40}
							height={40}
							onError={handleAvatarError}
							className='object-cover rounded-full min-w-10 min-h-10 md:block xl:block'
						/>
						<p className='hidden p-2 text-base cursor-pointer xl:block'>
							{getDisplayName()}
						</p>
					</div>

					<div
						className={`absolute right-0 bg-site-chrome text-site-chrome-foreground rounded shadow-button-secondary overflow-hidden flex flex-col items-center z-50 ${
							isMenuOpen
								? 'opacity-100 translate-y-0'
								: 'opacity-0 -translate-y-2 pointer-events-none'
						}  transition-custom min-w-40 ${
							isMobile
								? 'bottom-full top-auto mb-6'
								: 'top-full mt-6'
						}`}
					>
						<Link
							href='/user-profile'
							className='block px-4 py-3 hover:text-promo transition-custom'
							onClick={() => setIsMenuOpen(false)}
						>
							Профиль
						</Link>
						<Link
							href='/'
							className='block px-4 py-3 hover:text-promo transition-custom'
							onClick={() => setIsMenuOpen(false)}
						>
							Главная
						</Link>
						{isManagerOrAdmin() && (
							<Link
								href='/administrator'
								className='block px-4 py-3 hover:text-promo transition-custom'
								onClick={() => setIsMenuOpen(false)}
							>
								Панель управления
							</Link>
						)}
						<div className='justify-center hidden w-full px-3 py-3 border-t border-site-chrome-muted/30 lg:flex'>
							<ThemeToggle />
						</div>
						<button
							onClick={handleLogout}
							disabled={isLoggingOut}
							className='w-full px-4 py-3 text-center border-t cursor-pointer hover:text-promo transition-custom border-site-chrome-muted/30 disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{isLoggingOut ? 'Выход...' : 'Выйти'}
						</button>
					</div>
				</div>
			)}
		</>
	)
}

export default Profile
