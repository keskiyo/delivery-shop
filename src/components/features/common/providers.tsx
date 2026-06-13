'use client'

import { ThemeProvider } from '@/components/ui/theme/ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'
import { ToastContainer } from 'react-toastify'

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<>
			<ThemeProvider>{children}</ThemeProvider>
			<ToastContainer
				position='top-right'
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='colored'
				limit={4}
			/>
			<NextTopLoader />
		</>
	)
}
