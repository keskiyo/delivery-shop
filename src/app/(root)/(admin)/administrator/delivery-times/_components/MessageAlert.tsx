interface MessageAlertProps {
	message: string
}

export default function MessageAlert({ message }: MessageAlertProps) {
	return (
		<div className='p-3 md:p-4 mb-4 rounded border border-success/30 bg-success-soft text-success'>
			{message}
		</div>
	)
}
