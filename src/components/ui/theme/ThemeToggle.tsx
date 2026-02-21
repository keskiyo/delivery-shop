'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from './ThemeProvider'

function subscribe(callback: () => void) {
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
	mediaQuery.addEventListener('change', callback)
	return () => mediaQuery.removeEventListener('change', callback)
}

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme()

	useSyncExternalStore(
		subscribe,
		() => true,
		() => false,
	)

	const title = theme === 'light' ? 'Тёмная тема' : 'Светлая тема'

	return (
		<button
			onClick={toggleTheme}
			className='p-2 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors'
			aria-label={title}
			title={title}
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='25'
				height='25'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			>
				{theme === 'light' ? (
					<path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
				) : (
					<>
						<circle cx='12' cy='12' r='4' />
						<path d='M12 2v2' />
						<path d='M12 20v2' />
						<path d='m4.93 4.93 1.41 1.41' />
						<path d='m17.66 17.66 1.41 1.41' />
						<path d='M2 12h2' />
						<path d='M20 12h2' />
						<path d='m6.34 17.66-1.41 1.41' />
						<path d='m19.07 4.93-1.41 1.41' />
					</>
				)}
			</svg>
		</button>
	)
}
