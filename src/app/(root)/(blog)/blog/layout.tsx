import BlogSearch from '@/app/(root)/(blog)/blog/BlogSearch'
import { ReactNode } from 'react'

export default function BlogLayout({ children }: { children: ReactNode }) {
	return (
		<div className='container mx-auto px-4 py-8 text-foreground'>
			<div className='mb-8'>
				<BlogSearch />
			</div>

			{children}
		</div>
	)
}
