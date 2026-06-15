'use client'

import { acceptRules, checkRulesAccepted } from '@/actions/acceptRules'
import { checkBanStatus } from '@/actions/userBanActions'
import {
	BanInfo,
	CommentFormProps,
	UserRole,
} from '@/app/(root)/(blog)/blog/types/comments.types'
import { useAuthStore } from '@/store/authStore'
import { AlertCircle, Ban, Loader2, Send, Shield } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatBanDate } from '../../../../../../../../../../utils/formatBanDate'
import { RulesModal } from './RulesModal'

export default function CommentForm({
	articleId,
	parentId,
	onSuccess,
	placeholder = 'Напишите комментарий...',
}: CommentFormProps) {
	const { user } = useAuthStore()
	const [showRulesModal, setShowRulesModal] = useState(false)
	const [rulesAccepted, setRulesAccepted] = useState(false)
	const [content, setContent] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [banInfo, setBanInfo] = useState<BanInfo>({
		isBanned: false,
		bannedUntil: null,
	})
	const userId = user?.id || user?._id
	const userName = `${user?.surname} ${user?.name}`
	const userRole = (user?.role as UserRole) || 'user'

	useEffect(() => {
		async function checkBanStatusAction() {
			if (!userId) return

			try {
				const result = await checkBanStatus(userId)
				if (result.success) {
					setBanInfo({
						isBanned: result.isBanned ?? false,
						bannedUntil: result.bannedUntil || null,
					})
				}
			} catch (error) {
				console.error('Ошибка проверки статуса бана:', error)
			}
		}

		checkBanStatusAction()
	}, [userId])

	useEffect(() => {
		async function checkRules() {
			if (userId) {
				const accepted = await checkRulesAccepted(userId)
				setRulesAccepted(accepted)
			}
			setLoading(false)
		}

		checkRules()
	}, [userId])

	const handleAcceptRules = async () => {
		if (!userId) return

		const result = await acceptRules(userId)
		if (result.success) {
			setRulesAccepted(true)
			setShowRulesModal(false)
		} else {
			setError('Не удалось сохранить статус. Попробуйте еще раз.')
		}
	}

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()

		if (!userId || !userName) {
			setError('Войдите в систему, чтобы оставить комментарий')
			return
		}

		if (banInfo.isBanned) {
			if (banInfo.bannedUntil) {
				setError(
					`Вы заблокированы до ${formatBanDate(banInfo.bannedUntil)}`,
				)
			} else {
				setError('Вы заблокированы навсегда')
			}
			return
		}

		if (!content.trim()) {
			setError('Введите текст комментария')
			return
		}

		if (!rulesAccepted) {
			setShowRulesModal(true)
			return
		}

		try {
			setSubmitting(true)
			setError('')

			const response = await fetch('/api/comments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					articleId,
					parentId,
					content: content.trim(),
					authorId: userId,
					authorName: userName,
					authorRole: userRole,
				}),
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || 'Ошибка отправки')
			}

			const newComment = await response.json()
			onSuccess(newComment)
			setContent('')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ошибка отправки')
		} finally {
			setSubmitting(false)
		}
	}

	if (!userId) {
		return (
			<div className='text-center py-4 text-muted-foreground'>
				<Link
					href='/login'
					className='text-success hover:text-success font-medium'
				>
					Войдите
				</Link>{' '}
				в систему, чтобы оставлять комментарии
			</div>
		)
	}

	if (loading) {
		return <div className='text-center py-4 text-muted-foreground'>Загрузка...</div>
	}

	if (banInfo.isBanned) {
		return (
			<div className='bg-danger-soft border border-danger/30 rounded-lg p-6 text-center'>
				<Ban className='w-12 h-12 text-danger mx-auto mb-3' />
				<h3 className='text-lg font-semibold text-danger mb-2'>
					Вы заблокированы
				</h3>
				<p className='text-danger'>
					{banInfo.bannedUntil
						? `До ${formatBanDate(banInfo.bannedUntil)}`
						: 'Навсегда'}
				</p>
				<p className='text-sm text-muted-foreground mt-4'>
					По всем вопросам обращайтесь к администрации
				</p>
			</div>
		)
	}

	return (
		<>
			<form onSubmit={handleSubmit} className='space-y-3'>
				{error && (
					<div className='p-3 bg-danger-soft border border-danger/30 text-danger rounded text-sm'>
						{error}
					</div>
				)}

				{!rulesAccepted && (
					<div className='bg-warning-soft border border-warning/30 rounded p-3 text-sm text-white'>
						<p className='flex items-center gap-2'>
							<AlertCircle className='w-4 h-4' />
							Чтобы оставлять комментарии, необходимо ознакомиться
							с{' '}
							<button
								type='button'
								onClick={() => setShowRulesModal(true)}
								className='text-success hover:text-success underline font-medium cursor-pointer'
							>
								правилами сообщества
							</button>
						</p>
					</div>
				)}

				{rulesAccepted && (
					<div className='bg-success-soft border border-success/30 rounded p-3 text-sm text-success'>
						<p className='flex items-center gap-2'>
							<Shield className='w-4 h-4' />
							Вы приняли
							<Link
								href='/blog/rules'
								className='text-success hover:text-success text-sm'
							>
								правила сообщества.
							</Link>
							Спасибо!
						</p>
					</div>
				)}

				<textarea
					value={content}
					onChange={e => setContent(e.target.value)}
					placeholder={placeholder}
					className='w-full px-4 py-3 border border-border bg-input rounded focus:ring-2 focus:ring-ring focus:border-success outline-none  resize-none'
					rows={3}
					maxLength={2000}
					disabled={submitting}
				/>

				<div className='flex justify-between items-center'>
					<div className='text-sm text-muted-foreground'>
						{content.length}/2000 символов
					</div>
					<button
						type='submit'
						disabled={submitting || !content.trim()}
						className='px-6 py-2 bg-brand text-white rounded hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer transition-custom'
					>
						{submitting ? (
							<>
								<Loader2 className='w-4 h-4 animate-spin' />
								Отправка...
							</>
						) : (
							<>
								<Send className='w-4 h-4' />
								Отправить
							</>
						)}
					</button>
				</div>
			</form>
			<RulesModal
				isOpen={showRulesModal}
				onClose={() => setShowRulesModal(false)}
				onAccept={handleAcceptRules}
			/>
		</>
	)
}
