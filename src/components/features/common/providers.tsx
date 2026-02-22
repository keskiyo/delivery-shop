'use client'

// import { AuthModalHandler } from '@/components/features/common/AuthModalHandler'
import { ThemeProvider } from '@/components/ui/theme/ThemeProvider'
import { SessionProvider } from 'next-auth/react'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'
import { Toaster } from 'react-hot-toast'

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<>
			<SessionProvider>
				<ThemeProvider>
					{children}
				</ThemeProvider>
			</SessionProvider>
			{/* <AuthModalHandler /> */}
			<Toaster />
			<NextTopLoader />
		</>
	)
}
