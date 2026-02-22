import Breadcrumbs from '@/components/features/common/Breadcrumbs'
import Footer from '@/components/layout/footer/Footer'
import { Header } from '@/components/layout/header/Header'

export default function HomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<Header />
			<Breadcrumbs />
			<main className='min-h-screen'>{children}</main>
			<Footer />
		</>
	)
}
