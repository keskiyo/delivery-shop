import { ChevronRight } from 'lucide-react'

export const IconArrowAnim = () => {
	return (
		<div className='opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0  transition-custom'>
			<ChevronRight className='w-5 h-5 text-muted-foreground group-hover:text-foreground' />
		</div>
	)
}
