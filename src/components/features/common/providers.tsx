'use client'

import { ThemeProvider } from '@/components/ui/theme/ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'
import { Toaster } from 'react-hot-toast'

// Разные провайдеры

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<>
			<ThemeProvider>{children}</ThemeProvider>
			<Toaster />
			<NextTopLoader />
		</>
	)
}
