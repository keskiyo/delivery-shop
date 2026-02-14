import { Providers } from '@/components/features/common/providers'
import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'

const rubik = Rubik({
	variable: '--font-rubik',
	subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
	title: 'Delivery-shop',
	description: 'Разработка магазина доставки',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${rubik.variable} font-sans`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
