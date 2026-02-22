'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
	theme: Theme
	toggleTheme: () => void
}>({
	theme: 'light',
	toggleTheme: () => {},
})

function getCookie(name: string): string | null {
	if (typeof document === 'undefined') return null
	const value = `; ${document.cookie}`
	const parts = value.split(`; ${name}=`)
	if (parts.length === 2) return parts.pop()?.split(';').shift() || null
	return null
}

function setCookie(name: string, value: string, days = 365) {
	if (typeof document === 'undefined') return
	const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
	document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>('light')
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		const saved = getCookie('theme') as Theme | null
		if (saved) {
			setTheme(saved)
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
			setTheme(prefersDark ? 'dark' : 'light')
		}
	}, [])

	useEffect(() => {
		if (!mounted) return
		document.documentElement.classList.toggle('dark', theme === 'dark')
		setCookie('theme', theme)
	}, [theme, mounted])

	const toggleTheme = () => {
		setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
	}

	// Предотвращаем рендер до монтирования, чтобы избежать гидратационных ошибок
	if (!mounted) {
		return null
	}

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
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
