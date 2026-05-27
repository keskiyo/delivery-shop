import { CONFIG } from '../../../../../../../config/config'
import { tableStyles } from '../../styles'

const Email = ({
	email,
	emailVerified,
}: {
	email: string
	emailVerified: boolean
}) => {
	const isTemporaryEmail = (email: string): boolean => {
		return email.includes(CONFIG.TEMPORARY_EMAIL_DOMAIN)
	}

	return (
		<div
			className={`border-b border-border md:border-b-0 order-4 gap-2 ${tableStyles.colSpans.email} ${tableStyles.border.right}`}
		>
			<div className='text-xs font-semibold flex md:hidden'>Email:</div>
			{!isTemporaryEmail(email) ? (
				<div
					className={`text-xs break-all flex items-center ${
						emailVerified ? 'text-success' : 'text-danger'
					}`}
				>
					{email}
				</div>
			) : (
				<div className='md:text-sm flex items-center'>—</div>
			)}
		</div>
	)
}

export default Email
