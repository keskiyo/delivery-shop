'use client'

const OTPResendCode = ({
	canResend,
	timeLeft,
	onResendAction,
}: {
	canResend: boolean
	timeLeft: number
	onResendAction: () => void
}) => {
	return !canResend ? (
		<p className='text-xs text-center'>
			Запросить код повторно можно через{' '}
			<span className='font-bold'>{timeLeft} секунд</span>
		</p>
	) : (
		<button
			onClick={onResendAction}
			disabled={!canResend}
			className={`text-xs underline cursor-pointer text-center ${
				canResend
					? 'text-promo'
					: 'text-muted-foreground cursor-not-allowed'
			}`}
		>
			Отправить еще раз
		</button>
	)
}

export default OTPResendCode
