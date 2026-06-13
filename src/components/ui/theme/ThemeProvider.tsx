'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const ThemeContext = createContext<{
	theme: ThemeMode
	resolvedTheme: ResolvedTheme
	setTheme: (theme: ThemeMode) => void
	toggleTheme: () => void
	mounted: boolean
}>({
	theme: 'system',
	resolvedTheme: 'dark',
	setTheme: () => {},
	toggleTheme: () => {},
	mounted: false,
})

function getCookie(name: string): string | null {
	if (typeof document === 'undefined') return null

	const value = `; ${document.cookie}`
	const parts = value.split(`; ${name}=`)

	if (parts.length === 2) {
		return parts.pop()?.split(';').shift() || null
	}

	return null
}

function setCookie(name: string, value: string, days = 365) {
	if (typeof document === 'undefined') return

	const expires = new Date(
		Date.now() + days * 24 * 60 * 60 * 1000,
	).toUTCString()

	document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

function getSystemTheme(): ResolvedTheme {
	if (typeof window === 'undefined') return 'dark'

	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light'
}

function getResolvedTheme(theme: ThemeMode): ResolvedTheme {
	return theme === 'system' ? getSystemTheme() : theme
}

function isThemeMode(value: string | null): value is ThemeMode {
	return value === 'light' || value === 'dark' || value === 'system'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<ThemeMode>('system')
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark')
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		const savedTheme = getCookie('theme')
		const nextTheme = isThemeMode(savedTheme) ? savedTheme : 'system'

		setTheme(nextTheme)
		setResolvedTheme(getResolvedTheme(nextTheme))
		setMounted(true)
	}, [])

	useEffect(() => {
		if (!mounted || theme !== 'system') return

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const handleSystemThemeChange = () => {
			setResolvedTheme(getSystemTheme())
		}

		mediaQuery.addEventListener('change', handleSystemThemeChange)

		return () => {
			mediaQuery.removeEventListener('change', handleSystemThemeChange)
		}
	}, [mounted, theme])

	useEffect(() => {
		if (!mounted) return

		const nextResolvedTheme = getResolvedTheme(theme)

		setResolvedTheme(nextResolvedTheme)
		document.documentElement.classList.toggle(
			'dark',
			nextResolvedTheme === 'dark',
		)
		document.documentElement.classList.toggle(
			'light',
			nextResolvedTheme === 'light',
		)
		setCookie('theme', theme)
	}, [theme, mounted])

	const contextValue = useMemo(
		() => ({
			theme,
			resolvedTheme,
			setTheme,
			toggleTheme: () => {
				setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
			},
			mounted,
		}),
		[theme, resolvedTheme, mounted],
	)

	return (
		<ThemeContext.Provider value={contextValue}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)

	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}

	return context
}
