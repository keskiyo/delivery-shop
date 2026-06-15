import { AlertCircle, Calendar, Info, X } from 'lucide-react'
import { formatBanDate } from '../../../../../../../../../utils/formatBanDate'
import { BanUserModalProps } from '../types/comments.types'
import { banOptions } from '../utils/banOptions'

export const BanUserModal = ({
	isOpen,
	onClose,
	onBan,
	onUnban,
	userName,
	userId,
	isBanned,
	bannedUntil,
}: BanUserModalProps) => {
	if (!isOpen) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm'>
			<div className='w-full max-w-md transform bg-card text-card-foreground rounded shadow-2xl '>
				<div className='flex items-center justify-between p-6 border-b border-border'>
					<h2 className='text-xl font-semibold text-foreground'>
						{isBanned
							? 'Управление блокировкой'
							: 'Блокировка пользователя'}
					</h2>
					<button
						onClick={onClose}
						className='p-2 rounded-full cursor-pointer hover:bg-surface-subtle transition-custom group'
						title='Закрыть'
					>
						<X className='w-5 h-5 text-muted-foreground group-hover:text-foreground' />
					</button>
				</div>

				<div className='p-6'>
					<div className='p-4 mb-4 rounded bg-surface'>
						<p className='mb-1 text-foreground'>
							<span className='text-sm text-muted-foreground'>
								Пользователь:
							</span>{' '}
							<span className='font-semibold text-foreground'>
								{userName}
							</span>
						</p>
						<p className='font-mono text-xs text-muted-foreground'>
							ID: <span className='text-muted-foreground'>{userId}</span>
						</p>
					</div>

					{isBanned ? (
						<>
							<div className='p-5 mb-5 border border-danger/30 rounded bg-danger-soft'>
								<p className='flex items-center gap-2 mb-3 text-danger'>
									<AlertCircle className='w-5 h-5' />
									<span className='font-semibold'>
										Пользователь заблокирован
									</span>
								</p>
								{bannedUntil ? (
									<div className='p-3 text-foreground bg-card rounded'>
										<div className='flex flex-wrap gap-x-2'>
											<Calendar className='w-4 h-4 text-danger' />
											<p className='text-sm'>
												Блокировка будет снята:{' '}
											</p>
										</div>

										<p className='font-semibold text-danger'>
											{formatBanDate(bannedUntil)}
										</p>
									</div>
								) : (
									<div className='flex items-center gap-2 p-3 text-foreground bg-card rounded'>
										<Calendar className='w-4 h-4 text-danger' />
										<span className='font-semibold text-danger'>
											Блокировка навсегда
										</span>
									</div>
								)}
							</div>

							<p className='flex flex-row gap-3 p-3 mb-6 text-sm text-brand border border-brand/30 rounded bg-brand-soft'>
								<Info className='w-5 h-5 shrink-0' />
								<span>
									Вы можете разблокировать пользователя
									досрочно, чтобы он снова мог оставлять
									комментарии.
								</span>
							</p>

							<button
								onClick={onUnban}
								className='w-full px-4 py-3.5 bg-brand text-white rounded hover:bg-brand-hover font-medium  transition-custom shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
							>
								Разблокировать пользователя
							</button>
						</>
					) : (
						<>
							<p className='p-3 mb-6 text-sm border rounded text-warning-foreground bg-warning-soft border-warning/30'>
								<AlertCircle className='w-4 h-4 mb-2 shrink-0' />
								<span className='font-medium '>
									Заблокированный пользователь не сможет
									оставлять комментарии.
								</span>
							</p>

							<div className='grid grid-cols-2 gap-3 mb-2 sm:grid-cols-3'>
								{banOptions.map(option => (
									<button
										key={option.label}
										onClick={() => onBan(option.days)}
										className='px-3 py-3.5 rounded text-sm font-medium  transition-custom 
                              bg-surface-pressed text-foreground hover:bg-danger-soft hover:shadow-md 
                              active:scale-[0.97] cursor-pointer border border-border
                              hover:border-danger focus:ring-2 focus:ring-ring/50'
									>
										{option.label}
									</button>
								))}
							</div>
						</>
					)}
				</div>

				<div className='flex justify-end p-6 bg-surface-subtle border-t border-border rounded-b'>
					<button
						onClick={onClose}
						className='px-8 py-3 font-semibold text-foreground bg-surface-pressed border border-border rounded shadow-md cursor-pointer hover:bg-surface-hover hover:shadow-lg active:bg-surface-pressed active:scale-95 transition-custom focus:ring-4 focus:ring-ring'
					>
						{isBanned ? 'Закрыть' : 'Отмена'}
					</button>
				</div>
			</div>
		</div>
	)
}
