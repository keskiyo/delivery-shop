import { OctagonAlert } from 'lucide-react'

interface TooltipProps {
	text: string
	show?: boolean
}

const Tooltip = ({ text, show = true }: TooltipProps) => {
	if (!show) return null

	return (
		<div className='absolute left-0 top-full mt-1 w-full z-50'>
			<div className='relative bg-[#d80000] text-white text-sm p-2 rounded max-w-65 mx-auto flex items-center'>
				<OctagonAlert size={21} className='mr-4 shrink-0' />
				<div
					className='absolute left-1/2 -top-0.75 transform -translate-x-1/2 w-0 h-0
                     border-l-[6px] border-r-[6px] border-b-4
                     border-l-transparent border-r-transparent border-b-[#d80000]'
				></div>
				<span className='wrap-break-word'>{text}</span>
			</div>
		</div>
	)
}

export default Tooltip
