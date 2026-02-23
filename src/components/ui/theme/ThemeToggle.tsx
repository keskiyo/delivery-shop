'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme()

	const thumbPosition = theme === 'dark' ? 24 : 0

	const moonOpacity = theme === 'dark' ? 1 : 0
	const sunOpacity = theme === 'dark' ? 0 : 1

	const title = theme === 'light' ? 'Светлая тема' : 'Тёмная тема'

	const thumbBgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-white'
	const trackBgClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'

	return (
		<button
			onClick={toggleTheme}
			className='p-2 text-gray-300 cursor-pointer transition-colors'
			aria-label={title}
			title={title}
		>
			{/* Track (container) - h-8 и ширина w-14 */}
			<div
				className={`relative w-14 h-8 rounded-full overflow-hidden transition-colors duration-300 ${trackBgClass}`}
			>
				{/* Thumb - w-6 h-6 (24px), чтобы иконки были крупнее */}
				<div
					className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center ${thumbBgClass}`}
					style={{ transform: `translateX(${thumbPosition}px)` }}
				>
					{/* Moon icon - Размер w-5 h-5 (20px) и толще линии (strokeWidth="2.5") */}
					{theme === 'dark' ? (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2.5' // Увеличили толщину линий
							strokeLinecap='round'
							strokeLinejoin='round'
							className='text-white w-5 h-5 m-1 '
							style={{
								opacity: moonOpacity,
								transition: 'opacity 0.3s ease',
								transform: 'translateX(-1px)',
							}}
						>
							<path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
						</svg>
					) : (
						// Sun icon - Размер w-5 h-5 (20px) и толще линии (strokeWidth="2.5")
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2.5' // Увеличили толщину линий
							strokeLinecap='round'
							strokeLinejoin='round'
							className='text-orange-500 w-5 h-5 m-1'
							style={{
								opacity: sunOpacity,
								transition: 'opacity 0.3s ease',
							}}
						>
							<circle cx='12' cy='12' r='4' />
							<path d='M12 2v2' />
							<path d='M12 20v2' />
							<path d='m4.93 4.93 1.41 1.41' />
							<path d='m17.66 17.66 1.41 1.41' />
							<path d='M2 12h2' />
							<path d='M20 12h2' />
							<path d='m6.34 17.66-1.41 1.41' />
							<path d='m19.07 4.93-1.41 1.41' />
						</svg>
					)}
				</div>
			</div>
		</button>
	)
}
