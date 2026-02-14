import { Footer } from '@/components/layout/footer/Footer'
import { Header } from '@/components/layout/header/Header'
import { ThemeProvider } from '@/components/ui/theme/ThemeProvider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Запчасти для российских автомобилей в магазине Rus-avto.ru',
	description: 'Автозапчасти для российских автомобилей',
}

export default function HomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ThemeProvider>
			<Header />
			<main className='min-h-screen'>
				<div>{children}</div>
			</main>
			<Footer />
		</ThemeProvider>
	)
}
