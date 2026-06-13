import { ArticleProvider } from '@/app/contexts/ArticleContext'
import { CategoryProvider } from '@/app/contexts/CategoryContext'
import { RegFormProvider } from '@/app/contexts/RegFormContext'
import StoreProvider from '@/app/provider'
import { Providers } from '@/components/features/common/providers'
import StatesProvider from '@/store/StatesProvider'
import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import { cookies } from 'next/headers'
import 'react-toastify/dist/ReactToastify.css'
import { generateSiteMetadata } from '../../utils/generateSiteMetadata'
import './globals.css'

const rubik = Rubik({
	variable: '--font-rubik',
	subsets: ['latin', 'cyrillic'],
})

export async function generateMetadata(): Promise<Metadata> {
	return await generateSiteMetadata()
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
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									var match = document.cookie.match(/(?:^|; )theme=([^;]+)/);
									var savedTheme = match ? decodeURIComponent(match[1]) : 'system';
									var nextTheme = savedTheme === 'dark' || savedTheme === 'light'
										? savedTheme
										: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

									document.documentElement.classList.remove('dark', 'light');
									document.documentElement.classList.add(nextTheme);
								} catch (error) {}
							})();
						`,
					}}
				/>
			</head>
			<body className={`${rubik.variable} font-sans`}>
				<StoreProvider>
					<StatesProvider>
						<RegFormProvider>
							<CategoryProvider>
								<ArticleProvider>
									<Providers>{children}</Providers>
								</ArticleProvider>
							</CategoryProvider>
						</RegFormProvider>
					</StatesProvider>
				</StoreProvider>
			</body>
		</html>
	)
}
