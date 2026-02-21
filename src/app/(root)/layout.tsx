import Footer from '@/components/layout/footer/Footer'
import { Header } from '@/components/layout/header/Header'
import { ThemeProvider } from '@/components/ui/theme/ThemeProvider'

export default function HomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ThemeProvider>
			<Header />
			<main>
				<div>{children}</div>
			</main>
			<Footer />
		</ThemeProvider>
	)
}
