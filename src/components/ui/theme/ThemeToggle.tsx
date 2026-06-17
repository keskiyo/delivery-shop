'use client'

import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ThemeMode, useTheme } from './ThemeProvider'

const THEME_OPTIONS: Array<{
	mode: ThemeMode
	label: string
	icon: LucideIcon
}> = [
	{ mode: 'dark', label: 'Темная тема', icon: Moon },
	{ mode: 'light', label: 'Светлая тема', icon: Sun },
	{ mode: 'system', label: 'Как в системе', icon: Monitor },
]

interface ThemeToggleProps {
	variant?: 'inline' | 'mobileDropdown'
	className?: string
}

function ThemeOptionButton({
	mode,
	label,
	icon: Icon,
	isActive,
	onClick,
}: {
	mode: ThemeMode
	label: string
	icon: LucideIcon
	isActive: boolean
	onClick: (mode: ThemeMode) => void
}) {
	return (
		<button
			type='button'
			onClick={() => onClick(mode)}
			className={`flex size-8 cursor-pointer items-center justify-center rounded-full transition transition-custom focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-chrome-foreground/50 ${
				isActive
					? 'bg-site-chrome-foreground/15 text-site-chrome-foreground shadow-inner'
					: 'text-site-chrome-muted hover:bg-site-chrome-foreground/10 hover:text-site-chrome-foreground'
			}`}
			aria-label={label}
			aria-pressed={isActive}
			title={label}
		>
			<Icon className='size-4.5' strokeWidth={1.8} />
		</button>
	)
}

export function ThemeToggle({
	variant = 'inline',
	className = '',
}: ThemeToggleProps) {
	const { theme, setTheme, mounted } = useTheme()
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!isOpen) return

		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen])

	if (!mounted) return null

	const activeOption =
		THEME_OPTIONS.find(option => option.mode === theme) ?? THEME_OPTIONS[0]
	const ActiveIcon = activeOption.icon

	if (variant === 'mobileDropdown') {
		return (
			<div
				ref={dropdownRef}
				className={`relative lg:hidden ${className}`}
			>
				<button
					type='button'
					onClick={() => setIsOpen(prev => !prev)}
					className='flex size-10 cursor-pointer items-center justify-center rounded-full border border-site-chrome-muted/30 bg-site-chrome-muted/15 text-site-chrome-foreground transition transition-custom hover:bg-site-chrome-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-chrome-foreground/40'
					aria-label='Переключение темы'
					aria-expanded={isOpen}
					title='Переключение темы'
				>
					<ActiveIcon className='size-5' strokeWidth={1.8} />
				</button>

				<div
					className={`absolute bottom-full right-0 mb-3 flex w-11 flex-col items-center gap-1.5 rounded-full border border-site-chrome-muted/20 bg-site-chrome p-1.5 shadow-lg shadow-site-chrome/25 backdrop-blur transition transition-custom ${
						isOpen
							? 'translate-y-0 opacity-100'
							: 'pointer-events-none translate-y-2 opacity-0'
					}`}
					aria-label='Переключение темы'
				>
					{THEME_OPTIONS.map(option => (
						<ThemeOptionButton
							key={option.mode}
							{...option}
							isActive={theme === option.mode}
							onClick={mode => {
								setTheme(mode)
								setIsOpen(false)
							}}
						/>
					))}
				</div>
			</div>
		)
	}

	return (
		<div
			className={`flex items-center gap-1.5 rounded-full border border-site-chrome-muted/20 bg-site-chrome p-1.5 shadow-lg shadow-site-chrome/20 ${className}`}
			aria-label='Переключение темы'
		>
			{THEME_OPTIONS.map(option => (
				<ThemeOptionButton
					key={option.mode}
					{...option}
					isActive={theme === option.mode}
					onClick={setTheme}
				/>
			))}
		</div>
	)
}
