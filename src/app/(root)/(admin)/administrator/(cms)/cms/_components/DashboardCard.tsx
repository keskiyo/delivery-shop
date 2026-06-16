import { DashboardCardProps } from '../types/dashboard'

export const DashboardCard = ({ card, navigateTo }: DashboardCardProps) => {
	return (
		<div
			onClick={() => navigateTo(card.path)}
			className='bg-card rounded-xl shadow-md hover:shadow-lg  transition-custom cursor-pointer border border-border p-6 group'
		>
			<div className='flex flex-col h-full'>
				<div
					className={`p-3 ${card.colors.iconBg} rounded-lg w-fit mb-4 group-hover:scale-105 transition-transform transition-custom`}
				>
					<div className={card.colors.iconText}>{card.icon}</div>
				</div>
				<h3 className='text-lg font-semibold mb-2'>{card.title}</h3>
				<p className='text-sm mb-4 grow'>{card.description}</p>
				<button
					className={`w-full py-2 ${card.colors.buttonBg} text-white rounded-lg hover:opacity-90 transition-opacity transition-custom cursor-pointer mt-auto`}
				>
					{card.actionText}
				</button>
			</div>
		</div>
	)
}
