import { RegFormProvider } from '@/app/contexts/RegFormContext'
import { Providers } from '@/components/features/common/providers'
import StatesProvider from '@/store/StatesProvider'
import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'

const rubik = Rubik({
	variable: '--font-rubik',
	subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
	),
	title: 'Фудмаркет',
	description: 'Разработка магазина доставки',
	icons: {
		icon: '/icon.png',
	},
}

async function getInitialTheme() {
	const cookiesList = await cookies()
	const themeCookie = cookiesList.get('theme')?.value
	if (themeCookie === 'dark' || themeCookie === 'light') {
		return themeCookie
	}
	return 'dark'
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const initialTheme = await getInitialTheme()

	return (
		<html lang='ru' className={initialTheme} suppressHydrationWarning>
			<body className={`${rubik.variable} font-sans`}>
				<StatesProvider>
					<RegFormProvider>
						<Providers>{children}</Providers>
					</RegFormProvider>
				</StatesProvider>
			</body>
		</html>
	)
}
