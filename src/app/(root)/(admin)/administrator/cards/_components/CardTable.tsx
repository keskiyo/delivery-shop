'use client'

import { Power, PowerOff, Trash2 } from 'lucide-react'
import { formatCardNumber } from '../../../../../../../utils/validation/validProfileCard'
import { CardTableProps } from '../types/cards.types'

export const CardTable = ({
	cards,
	onToggleActive,
	onDelete,
}: CardTableProps) => {
	return (
		<div className='space-y-3'>
			<div className='hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-surface rounded-lg text-xs font-medium text-muted-foreground uppercase tracking-wider'>
				<div className='col-span-1'>№</div>
				<div className='col-span-3'>Номер карты</div>
				<div className='col-span-2'>Статус</div>
				<div className='col-span-3'>Владелец</div>
				<div className='col-span-2'>Дата</div>
				<div className='col-span-1 text-center'>Действия</div>
			</div>

			{cards.map(card => (
				<div
					key={card._id}
					className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-2 sm:px-4 py-3 rounded-lg items-start sm:items-center border ${
						!card.isActive
							? 'border-border bg-surface'
							: 'border-transparent hover:border-border hover:bg-surface'
					}`}
				>
					<div className='col-span-1 sm:hidden flex justify-between items-center w-full mb-1'>
						<span className='text-xs font-medium text-muted-foreground'>
							п/п № {card.order}
						</span>
						<span
							className={`px-2 py-1 text-xs rounded ${
								card.isActive
									? 'bg-success-soft text-success'
									: 'bg-surface-pressed text-foreground'
							}`}
						>
							{card.isActive ? 'Активна' : 'Не активна'}
						</span>
					</div>

					<div className='col-span-1 sm:block hidden text-sm text-foreground'>
						{card.order}
					</div>

					<div className='col-span-3 text-sm font-mono text-foreground break-all sm:break-normal'>
						{formatCardNumber(card.cardNumber, true)}
					</div>

					<div className='col-span-2 hidden sm:block'>
						<span
							className={`px-2 py-1 text-xs rounded ${
								card.isActive
									? 'bg-success-soft text-success'
									: 'bg-surface-pressed text-foreground'
							}`}
						>
							{card.isActive ? 'Активна' : 'Не активна'}
						</span>
					</div>

					<div className='col-span-3 text-sm text-foreground'>
						{card.owner ? (
							<div className='flex flex-col sm:block'>
								<div className='truncate max-w-37.5 sm:max-w-none'>
									{card.owner.surname} {card.owner.name}
								</div>
								<div className='text-xs text-muted-foreground truncate max-w-37.5 sm:max-w-none'>
									{card.owner.phoneNumber}
								</div>
							</div>
						) : (
							<span className='text-muted-foreground'>Свободна</span>
						)}
					</div>

					<div className='col-span-2 text-xs sm:text-sm text-muted-foreground'>
						{new Date(card.createdAt).toLocaleDateString('ru-RU')}
					</div>

					<div className='col-span-1 text-sm text-muted-foreground'>
						<div className='flex gap-3 sm:gap-2 justify-end sm:justify-center'>
							<button
								onClick={() => onToggleActive(card)}
								className={`${card.isActive ? 'text-promo hover:text-promo' : 'text-success hover:text-success'} cursor-pointer p-1 sm:p-0`}
								title={
									card.isActive
										? 'Деактивировать карту'
										: 'Активировать карту'
								}
							>
								{card.isActive ? (
									<Power className='h-5 w-5 sm:h-4 sm:w-4' />
								) : (
									<PowerOff className='h-5 w-5 sm:h-4 sm:w-4' />
								)}
							</button>

							<button
								onClick={() => onDelete(card)}
								className='text-danger hover:text-danger cursor-pointer p-1 sm:p-0'
								title='Удалить карту'
							>
								<Trash2 className='h-5 w-5 sm:h-4 sm:w-4' />
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
