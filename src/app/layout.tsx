import { Providers } from '@/components/features/common/providers'
import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'

const rubik = Rubik({
	variable: '--font-rubik',
	subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
	title: 'Фудмаркет',
	description: 'Разработка магазина доставки',
}

async function getInitialTheme() {
	const cookiesList = await cookies()
	const themeCookie = cookiesList.get('theme')?.value
	if (themeCookie === 'dark' || themeCookie === 'light') {
		return themeCookie
	}
	return 'light'
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
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
