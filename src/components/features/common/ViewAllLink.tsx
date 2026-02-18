import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

const ViewAllLink = ({ btnText, href }: { btnText: string; href: string }) => {
	return (
		<Link
			href={href}
			className='flex flex-row items-center gap-x-2 cursor-pointer'
		>
			<p className='text-base text-center duration-300'>{btnText}</p>
			<ChevronRight size={24} />
		</Link>
	)
}

export default ViewAllLink
