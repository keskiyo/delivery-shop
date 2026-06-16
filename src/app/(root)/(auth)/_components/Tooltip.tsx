import { OctagonAlert } from 'lucide-react'

interface TooltipProps {
	text: string
	position?: 'top' | 'bottom'
	cardPosition?: boolean
}

const Tooltip = ({
	text,
	position = 'bottom',
	cardPosition = false,
}: TooltipProps) => {
	return (
		<div
			className={`absolute left-0 mt-2 w-full  transition-custom ease-in-out ${
				position === 'top' ? (cardPosition ? '-top-30' : '-top-13') : ''
			}`}
		>
			<div
				className={`relative bg-danger text-white text-sm p-2 rounded max-w-65 mx-auto flex items-center z-50 opacity-0 animate-fadeIn ${
					position === 'bottom' ? 'mb-2' : 'mt-1'
				}`}
			>
				<OctagonAlert size={21} className='mr-4 shrink-0' />
				{/* Треугольник внизу, если position="top" */}
				{position === 'top' ? (
					<div
						className='absolute left-1/2 -bottom-0.75 transform -translate-x-1/2 w-0 h-0
                     border-l-[6px] border-r-[6px] border-t-4
                     border-l-transparent border-r-transparent border-t-danger'
					></div>
				) : (
					<div
						className='absolute left-1/2 -top-0.75 transform -translate-x-1/2 w-0 h-0
                     border-l-[6px] border-r-[6px] border-b-4
                     border-l-transparent border-r-transparent border-b-danger'
					></div>
				)}
				{text}
			</div>
		</div>
	)
}

export default Tooltip
